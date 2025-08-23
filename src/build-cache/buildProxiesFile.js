const { chromium } = require("playwright");
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs"); 

async function testProxy(typeParam ,ip, port) {
  let browser = null;
  const type = typeParam.toLowerCase();

  const proxyUrl = `${type}://${ip}:${port}`;
  console.log(`⏳ Testando proxy: ${proxyUrl}`);

  try {

    browser = await chromium.launch({
      proxy: {
        server: proxyUrl,
      },
      timeout: 10000,
    });

    const page = await browser.newPage();

    const productUri = "https://www.mercadolivre.com.br/alimento-premier-super-premium-racas-especificas-shih-tzu-para-co-adulto-de-raza-pequena-sabor-frango-de-75-kg/p/MLB12017777";
   
    await page.goto(productUri, {
              waitUntil: 'domcontentloaded',
              timeout: 600000
    });
 
    const targetFailedString = '/gz/account-verification';

    const currentUrl = page.url();

    if (currentUrl.includes(targetFailedString)) {
      throw new Error('Bloqueio de login: A página de verificação de conta foi detectada.');
    }

    console.log(`✅ FUNCIONA: ${proxyUrl} -> ${currentUrl}`);
    return {type, ip, port, success: true };
  } catch (err) {
    console.log(`❌ FALHOU: ${proxyUrl}, causa: `+err.message);
    return {type, ip, port, success: false , exception: err.message};
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function fetchProxiesHttp() {
  // Lista de URLs para buscar os proxies. Você pode adicionar mais aqui.
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
  
        const proxyKey = `${ip}:${port}`;

        if (!uniqueProxies.has(proxyKey)) {
          uniqueProxies.add(proxyKey);
          proxies.push({ ip, port, type });
        }
      });

    } catch (error) {
      console.error(`❌ Erro ao buscar proxies da URL ${url}: ${error.message}`);
    }
  }

  console.log(`📋 Total de proxies encontrados (sem duplicatas): ${proxies.length}.`);

  return proxies;
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

    // if (https === "yes") {
      proxies.push({ ip, port , type });
    // }

    counterAllProxies++;

  });

  console.log(`📋 Encontrados ${proxies.length} proxies socks.`);

  return proxies;
}

async function main() {

  const listHttp = await mainProxiesHttp();
  const listSocks = await mainProxiesSocks();
  
  const workingProxies = [...listHttp, ...listSocks];

  fs.writeFileSync(
      "valid-proxies.json",
      JSON.stringify(workingProxies, null, 2)
    );

  console.log("\n📁 Lista de proxies válidos salva em valid-proxies.json");
}

async function mainProxiesHttp(){
  const proxies = await fetchProxiesHttp();

    const workingProxies = [];
    const limit = 5;

    for (let i = 0; i < proxies.length; i += limit) {
      const batch = proxies.slice(i, i + limit);
      const results = await Promise.all(
        batch.map((p) => testProxy(p.type, p.ip, p.port))
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
        batch.map((p) => testProxy(p.type, p.ip, p.port))
      );
      workingProxies.push(...results.filter((r) => r.success));
    }

    console.log("\n✅ Proxies funcionando:");
    console.log(workingProxies);

    return workingProxies;
}


main().catch(console.error);