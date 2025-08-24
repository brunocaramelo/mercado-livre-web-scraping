const { chromium , firefox, webkit } = require('playwright-extra');
const NavigatorFactory = require('../tools/NavigatorFactory');
const fs = require('fs');
const path = require("path");
const stealth = require('puppeteer-extra-plugin-stealth')(
    {
        useragent: true
    }
);

module.exports = async function buildProductList() {
  
  chromium.use(stealth);

  const navigatorFactory = new NavigatorFactory();
  
  const context = await navigatorFactory.launchWithOptionsParamContext(chromium,{ headless: false });

  let page = await context.newPage();
  
  await page.goto('https://www.mercadolivre.com.br/mais-vendidos');

  await page.waitForSelector('.nav-search-input');

  const productDetails = await page.$$eval(
        '.andes-card.andes-card--flat.andes-card--padding-16.andes-card--animated',
        elements => elements.map(el => {
            const linkEl = el.querySelector('a.splinter-link');
            const nameEl = el.querySelector('h3.dynamic-carousel__title');
            const priceWhole = el.querySelector('.dynamic-carousel__price span');
            const priceDecimals = el.querySelector('.dynamic-carousel__price-decimals');

            const name = nameEl ? nameEl.innerText.trim() : null;
            const link = linkEl ? linkEl.href : null;

            let price = null;
            if (priceWhole) {
            price = priceWhole.innerText.trim();
            if (priceDecimals) {
                price += ',' + priceDecimals.innerText.trim();
            }
            }

            return { name, link, price };
        })
    );

//   console.log(JSON.stringify(productDetails));

  fs.writeFileSync(path.join(__dirname, 'random-products-list.json'), JSON.stringify(productDetails));

  console.log(`Foram salvos ${productDetails.length} links em random-products-list.json`);

  await navigatorFactory.close();
};