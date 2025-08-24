const { chromium , firefox, webkit } = require('playwright-extra');
const NavigatorFactory = require('../tools/NavigatorFactory');
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs"); 
const path = require("path");
const buildProductList = require('./buildProductListStatic');
const stealth = require('puppeteer-extra-plugin-stealth')(
    {
        useragent: true
    }
);

async function getOneRandomProductMl(){
  const filePath = path.join(__dirname, "random-products-list.json");
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(data);

    if (!Array.isArray(products)) {
      throw new Error("O JSON não contém uma lista de produtos válida.");
    }

    const randomIndex = Math.floor(Math.random() * products.length);
    const randomProduct = products[randomIndex].link;

    return randomProduct;
  } catch (err) {
    console.error("Erro ao ler ou processar o arquivo:", err.message);
  }
}

async function testProxy(typeParam ,ip, port, country) {
  let browser = null;
  const type = typeParam.toLowerCase();

  const proxyUrl = `${type}://${ip}:${port}`;
  console.log(`⏳ Testando proxy: ${proxyUrl}`);

  chromium.use(stealth);
    
  const navigatorFactory = new NavigatorFactory();
  
  try {
    const context = await navigatorFactory.launchWithOptionsParamContext(chromium,{
      proxy: {
        server: proxyUrl,
      },
      timeout: 40000,
      headless: false
    });

    const page = await context.newPage();

    const productUri = await getOneRandomProductMl();
   
    await page.goto(productUri, {
              waitUntil: 'domcontentloaded',
              timeout: 900000
    });
 
    const targetFailedString = '/gz/account-verification';

    const currentUrl = page.url();

    if (currentUrl.includes(targetFailedString)) {
      throw new Error('Bloqueio de login: A página de verificação de conta foi detectada.');
    }

    console.log(`✅ FUNCIONA: ${proxyUrl} em produto ${currentUrl}`);
    return {type, ip, port, success: true , country: country};
  } catch (err) {
    console.log(`❌ FALHOU: ${proxyUrl}, causa: `+err.message);
    return {type, ip, port, success: false , exception: err.message, country: country};
  } finally {
      await navigatorFactory.close();
  }
}

async function fetchProxiesHttp() {

  const proxyUrls = [
    "https://free-proxy-list.net/pt/",
    "https://free-proxy-list.net/pt/us-proxy.html",
    "https://free-proxy-list.net/pt/uk-proxy.html",
    "https://free-proxy-list.net/pt/ssl-proxy.html",
    "https://free-proxy-list.net/pt/anonymous-proxy.html",
    "https://free-proxy-list.net/pt/google-proxy.html",
  ];

  console.log("🔍 Baixando lista de proxies http...");
  
  const uniqueProxies = new Set();
  const proxies = [];

  for (const url of proxyUrls) {
    try {
      console.log(`📥 Processando URL: ${url}`);
      const { data } = await axios.get(url, { timeout: 10000 }); // Adicionado timeout
      const $ = cheerio.load(data);
  
      $(".table-striped tbody tr").each((_, row) => {
        const tds = $(row).find("td");
        const ip = $(tds[0]).text();
        const port = $(tds[1]).text();
        const type = 'http';
        const country = $(tds[2]).text();

        const proxyKey = `${ip}:${port}`;

        if (!uniqueProxies.has(proxyKey)) {
          uniqueProxies.add(proxyKey);
          proxies.push({ ip, port, type , country});
        }
      });

    } catch (error) {
      console.error(`❌ Erro ao buscar proxies da URL ${url}: ${error.message}`);
    }
  }

  console.log(`📋 Total de proxies encontrados (sem duplicatas): ${proxies.length}.`);

  return proxies;
}

async function fetchProxysScrapeFromApi() {
    console.log("🔍 Baixando lista de proxies da API ProxyScrape...");

    const apiUrl = "https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&proxy_format=protocolipport&format=text";

    const proxies = [];

    try {
      const response = await axios.get(apiUrl, { timeout: 10000 });
      const data = response.data;
      
      const lines = data.split('\n');
      
      const uniqueProxies = new Set();
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') {
          return;
        }

        const [protocolPart, addressPart] = trimmedLine.split('://');
        
        if (!addressPart) {
          return;
        }

        const [ip, port] = addressPart.split(':');
        
        const proxyKey = `${protocolPart}://${ip}:${port}`;

        if (ip && port && !uniqueProxies.has(proxyKey)) {
          uniqueProxies.add(proxyKey);
          proxies.push({
            ip,
            port,
            type: protocolPart,
            country: 'proxyscrape',
          });
        }
      });

      return proxies;
    } catch (error) {
      console.error(`❌ Erro ao buscar proxies da API ProxyScrape: ${error.message}`);
      return [];
  }
}

async function fetchProxiesSocks() {
  console.log("🔍 Baixando lista de proxies socks...");
  const { data } = await axios.get("https://free-proxy-list.net/pt/socks-proxy.html");
  const $ = cheerio.load(data);

  let counterAllProxies = 0;
  const proxies = [];
  $(".table-striped tbody tr").each((_, row) => {
    const tds = $(row).find("td");
    const ip = $(tds[0]).text();
    const port = $(tds[1]).text();
    const type = $(tds[4]).text();
    const country = $(tds[2]).text();
    
    // if (https === "yes") {
      proxies.push({ ip, port , type , country});
    // }

    counterAllProxies++;

  });

  console.log(`📋 Encontrados ${proxies.length} proxies socks.`);

  return proxies;
}

async function main() {

  await buildProductList();

  const listHttp = await mainProxiesHttp();
  const listSocks = await mainProxiesSocks();
  
  const workingProxies = [...listHttp, ...listSocks];

  fs.writeFileSync(
      path.join(__dirname, "valid-proxies.json"),
      JSON.stringify(workingProxies, null, 2)
    );

  console.log("\n📁 Lista de proxies válidos salva em valid-proxies.json");
}

async function mainProxiesHttp(){
    
    const [proxiesFromHttp, proxiesFromApi] = await Promise.all([
      fetchProxiesHttp(),
      fetchProxysScrapeFromApi()
    ]);

    const allProxies = [...proxiesFromHttp, ...proxiesFromApi];
    const uniqueProxies = new Map();

    allProxies.forEach(proxy => {
      const key = `${proxy.ip}:${proxy.port}`;
      if (!uniqueProxies.has(key)) {
        uniqueProxies.set(key, proxy);
      }
    });

    const finalProxiesList = Array.from(uniqueProxies.values());

    const workingProxies = [];
    const limit = 5;

    for (let i = 0; i < finalProxiesList.length; i += limit) {
      const batch = finalProxiesList.slice(i, i + limit);
      const results = await Promise.all(
        batch.map((p) => testProxy(p.type, p.ip, p.port, p.country))
      );
      workingProxies.push(...results.filter((r) => r.success));
    }

    console.log("\n✅ Proxies funcionando:");
    console.log(workingProxies);

    return workingProxies;    
}

async function mainProxiesSocks(){
  
  // return [];

  const proxies = await fetchProxiesSocks();

    const workingProxies = [];
    const limit = 5;

    for (let i = 0; i < proxies.length; i += limit) {
      const batch = proxies.slice(i, i + limit);
      const results = await Promise.all(
        batch.map((p) => testProxy(p.type, p.ip, p.port, p.country))
      );
      workingProxies.push(...results.filter((r) => r.success));
    }

    console.log("\n✅ Proxies funcionando:");
    console.log(workingProxies);

    return workingProxies;
}


main().catch(console.error);