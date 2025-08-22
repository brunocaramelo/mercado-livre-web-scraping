const { chromium } = require("playwright");
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs"); // Para manipular o arquivo JSON

// Função para testar um único proxy com Playwright
async function testProxy(ip, port) {
  let browser = null;
  try {
    const proxyUrl = `http://${ip}:${port}`;
    console.log(`⏳ Testando proxy: ${proxyUrl}`);

    // Lança um novo navegador com a configuração de proxy
    browser = await chromium.launch({
      proxy: {
        server: proxyUrl,
      },
      timeout: 10000, // Tempo limite para o lançamento do navegador
    });

    const page = await browser.newPage();

    // Tenta acessar o site de verificação de IP com um tempo limite
    await page.goto("https://api.ipify.org?format=json", {
      timeout: 15000, // Tempo limite para a navegação
    });

    const body = await page.innerText("body");
    const data = JSON.parse(body);

    console.log(`✅ FUNCIONA: ${proxyUrl} -> ${data.ip}`);
    return { ip, port, success: true };
  } catch (err) {
    console.log(`❌ FALHOU: ${ip}:${port}`);
    return { ip, port, success: false };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Função original para buscar proxies
async function fetchProxiesHttp() {
  console.log("🔍 Baixando lista de proxies http...");
  const { data } = await axios.get("https://free-proxy-list.net/pt/");
  const $ = cheerio.load(data);

  let counterAllProxies = 0;
  const proxies = [];
  $(".table-striped tbody tr").each((_, row) => {
    const tds = $(row).find("td");
    const ip = $(tds[0]).text();
    const port = $(tds[1]).text();
    const type = 'http';
    const https = $(tds[6]).text();

    if (https === "yes") {
      proxies.push({ ip, port , type });
    }

    counterAllProxies++;

  });

  console.log(`📋 Buscando em ${counterAllProxies} proxies http.`);
  console.log(`📋 Encontrados ${proxies.length} proxies http.`);

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

// Função principal que orquestra tudo
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
    const limit = 5; // Limita a concorrência para evitar sobrecarga

    for (let i = 0; i < proxies.length; i += limit) {
      const batch = proxies.slice(i, i + limit);
      const results = await Promise.all(
        batch.map((p) => testProxy(p.ip, p.port))
      );
      workingProxies.push(...results.filter((r) => r.success));
    }

    console.log("\n✅ Proxies funcionando:");
    console.log(workingProxies);

    // Salva os proxies em um arquivo JSON
    

}

async function mainProxiesSocks(){
  const proxies = await fetchProxiesSocks();

    const workingProxies = [];
    const limit = 5; // Limita a concorrência para evitar sobrecarga

    for (let i = 0; i < proxies.length; i += limit) {
      const batch = proxies.slice(i, i + limit);
      const results = await Promise.all(
        batch.map((p) => testProxy(p.ip, p.port))
      );
      workingProxies.push(...results.filter((r) => r.success));
    }

    console.log("\n✅ Proxies funcionando:");
    console.log(workingProxies);

    // Salva os proxies em um arquivo JSON
    fs.writeFileSync(
      "valid-proxies.json",
      JSON.stringify(workingProxies, null, 2)
    );

}


main().catch(console.error);