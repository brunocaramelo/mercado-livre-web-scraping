const { chromium , firefox, webkit } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();

const ProductBaseInfo = require('./parts/ProductBaseInfo');
const ProductFullDescription = require('./parts/ProductFullDescription');
const ProductSpecifications = require('./parts/ProductSpecifications');
const ProductCurrentImages = require('./parts/ProductCurrentImages');
const ProductGetVariationOptions = require('./parts/ProductGetVariationOptions');
const ProductAsyncExtractAllVariations = require('./parts/ProductAsyncExtractAllVariations');
const WaitingFor = require('../tools/WaitingFor');

const NumbersTools = require('../tools/Numbers');

module.exports = class ScrapperProduct {

    constructor(productUri) {
        this.productUri = productUri;
        this.doDelay = new WaitingFor();
        this.numbersTools = new NumbersTools();
    }
    
    async handle() {
      
        console.log('('+this.constructor.name+') starting process');

        firefox.use(stealth);

        this.browserInstance = await firefox.launch({
           headless: false 
        });

        const context = await this.browserInstance.newContext();
        
        const page = await context.newPage();
        
        await this.ofuscateBotBrowser(page);

        const returnProduct =  await this.processProductPage(page);
       
        console.log('('+this.constructor.name+') ending process');

        await this.browserInstance.close();

        return returnProduct;
    }

    async processProductPage(page) {

          await page.goto(this.productUri, {
              waitUntil: 'domcontentloaded',
              timeout: 600000
          });
          
          await page.waitForSelector('.ui-pdp-title');

          await this.closeCepPopUp(page);

          await this.mouseRandomMove(page);

          this.doDelay.rangeMicroseconds(510, 1502);

          const baseInfo = await this.getBaseInfo(page);
          const description = await this.getFullDescription(page);
          const specifications = await this.getSpecifications(page);
          const baseImages = await this.getCurrentImages(page);
          const variations = await this.extractAllVariations(page);
      
          const { idProductPage, urlProductPage } = await page.evaluate(() => {
            const idProductPage = window.location.pathname.split('/p/')[1]?.split('?')[0];
            const urlProductPage = window.location.href;
            return { idProductPage, urlProductPage };
          });

          return {
            id: idProductPage,
            url: urlProductPage,
            title: baseInfo.title,
            price: {
              current: baseInfo.price,
              currency: baseInfo.currency,
            },
            description,
            specifications,
            images: baseImages,
            variations,
            metadata: {
              extracted_at: new Date().toISOString(),
              source: 'Mercado Livre'
            }
          };

      }

      async closeCepPopUp(page) {        
        try {
          console.log('(closeCepPopUp) started');
          const selector = 'button.onboarding-cp-button.andes-button.andes-button--transparent.andes-button--small[data-js="onboarding-cp-close"][data-origin="header"]';
          
          await page.waitForSelector(selector, { timeout: 5000 });
          
          const closeButton = page.locator(selector);
        
          if (await closeButton.isVisible()) {
            await closeButton.click();
            console.log('(closeCepPopUp) ended');
          }
        } catch (e) {
          console.log('(closeCepPopUp) not found');
        } 
      }

      async getBaseInfo(page) {
        await this.mouseRandomMove(page);
        return new ProductBaseInfo(page).handle();
      };

      async getFullDescription(page) {
        await this.mouseRandomMove(page);
        return new ProductFullDescription(page).handle();
      };

      async getSpecifications(page) {
        await this.mouseRandomMove(page);
        return new ProductSpecifications(page).handle();
      };

      async getCurrentImages(page) {
        await this.mouseRandomMove(page);
        return new ProductCurrentImages(page).handle();
      };

      async getVariationOptions(page) {       
        await this.mouseRandomMove(page);     
        return new ProductGetVariationOptions(page).handle();
      };

      async extractAllVariations(page) {
        
        await this.mouseRandomMove(page);
        if((await this.getVariationOptions(page)).length == 0) return [];

        return new ProductAsyncExtractAllVariations(
          page,
           {
            baseImages: await this.getCurrentImages(page),
            baseInfo: await this.getBaseInfo(page),
            baseDescription: await this.getFullDescription(page),
            baseSpecs: await this.getSpecifications(page),
        }).handle();

      };
  
      async mouseRandomMove(page){
        await page.mouse.move(this.numbersTools.randomIntFromInterval(1,500), 
                                this.numbersTools.randomIntFromInterval(11,790), 
                                {steps: this.numbersTools.randomIntFromInterval(10,23)}
                              );
      }

      async ofuscateBotBrowser(page){
        await page.addInitScript(() => {
          Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2, 3],
          });
          Object.defineProperty(navigator, 'languages', {
            get: () => ['pt-BR', 'pt', 'en-US', 'en'],
          });
          Object.defineProperty(navigator, 'webdriver', {
            get: () => false
          });
        });

      }

}

