const { chromium } = require('playwright');

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
        
        this.browserInstance = await chromium.launch({ headless: false });

        const context = await this.browserInstance.newContext({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        
        const page = await context.newPage();
        
        await this.ofuscateBotBrowser(page);

        const returnProduct =  await this.processProductPage(page);
       
        await this.browserInstance.close();

        return returnProduct;

    }

    async processProductPage(page) {

          await page.goto(this.productUri, {
              waitUntil: 'domcontentloaded',
              timeout: 600000
          });
          
          await page.waitForSelector('.ui-pdp-title');

          this.mouseRandomMove(page);

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

      async getBaseInfo(page) {
        this.mouseRandomMove(page);
        return new ProductBaseInfo(page).handle();
      };

      async getFullDescription(page) {
        this.mouseRandomMove(page);
        return new ProductFullDescription(page).handle();
      };

      async getSpecifications(page) {
        this.mouseRandomMove(page);
        return new ProductSpecifications(page).handle();
      };

      async getCurrentImages(page) {
        this.mouseRandomMove(page);
        return new ProductCurrentImages(page).handle();
      };

      async getVariationOptions(page) {       
        this.mouseRandomMove(page);     
        return new ProductGetVariationOptions(page).handle();
      };

      async extractAllVariations(page) {
        this.mouseRandomMove(page);
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

