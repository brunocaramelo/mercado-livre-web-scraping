const { chromium , firefox, webkit } = require('playwright-extra');
const path = require('path');
require('dotenv').config();
const stealth = require('puppeteer-extra-plugin-stealth')(
    {
      useragent: true
    }
  );


const ProductBaseInfo = require('./parts/ProductBaseInfo');
const ProductFullDescription = require('./parts/ProductFullDescription');
const ProductSpecifications = require('./parts/ProductSpecifications');
const ProductCurrentImages = require('./parts/ProductCurrentImages');
const ProductGetVariationOptions = require('./parts/ProductGetVariationOptions');
const ProductAsyncExtractAllVariations = require('./parts/ProductAsyncExtractAllVariations');
const WaitingFor = require('../tools/WaitingFor');
const NumbersTools = require('../tools/Numbers');
const HumanNavigates = require('../tools/HumanNavigates');
const HideBotTool = require('../tools/HideBotTool');
const NavigatorFactory = require('../tools/NavigatorFactory');

module.exports = class ScrapperProduct {

    constructor(productUri) {
        this.productUri = productUri;
        this.doDelay = new WaitingFor();
        this.numbersTools = new NumbersTools();
        this.humanNavigates = new HumanNavigates();
        this.hideBotTool = new HideBotTool();
        this.navigatorFactory = new NavigatorFactory();
    }
    
    async handle() {
      
        console.log((new Date()).toISOString()+' ('+this.constructor.name+') starting process');

        chromium.use(stealth);

        const context = await this.navigatorFactory.launchAndContexthStrategy(chromium);
        
        let page = await context.newPage();
        
        page = await this.ofuscateBotBrowser(page);

        const returnProduct =  await this.processProductPage(page);
       
        console.log((new Date()).toISOString()+' ('+this.constructor.name+') ending process');

        await this.navigatorFactory.close();

        return returnProduct;
    }

    async processProductPage(page) {

          await page.goto(this.productUri, {
              waitUntil: 'domcontentloaded',
              timeout: 600000
          });
          
          await this.checkBlockedLogin(page);

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
          console.log((new Date()).toISOString()+'(closeCepPopUp) started');
          const selector = 'button.onboarding-cp-button.andes-button.andes-button--transparent.andes-button--small[data-js="onboarding-cp-close"][data-origin="header"]';
          
          await page.waitForSelector(selector, { timeout: 5000 });
          
          const closeButton = page.locator(selector);
        
          if (await closeButton.isVisible()) {
            await closeButton.click();
            console.log((new Date()).toISOString()+'(closeCepPopUp) ended');
          }
        } catch (e) {
          console.log((new Date()).toISOString()+'(closeCepPopUp) not found');
        } 
      }

     async checkBlockedLogin(page) {
      const selector = 'span.andes-button__content:has-text("Sou novo")';
      const element = await page.$(selector);

      console.log((new Date()).toISOString()+'(checkBlockedLogin) Verificando se fui bloqueado pela plataforma');

     if (element) {
        throw new Error("⚠️ Bloqueio de login detectado: botão 'Sou novo' apareceu.");
      }
     return true;
    }
      async getBaseInfo(page) {
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(900, 3500))
        await this.mouseRandomMove(page);
        return new ProductBaseInfo(page).handle();
      };

      async getFullDescription(page) {
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(100, 1000))
        await this.mouseRandomMove(page);
        return new ProductFullDescription(page).handle();
      };

      async getSpecifications(page) {
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(200, 600))
        await this.mouseRandomMove(page);
        return new ProductSpecifications(page).handle();
      };

      async getCurrentImages(page) {
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(930, 3900))
        await this.mouseRandomMove(page);
        return new ProductCurrentImages(page).handle();
      };

      async getVariationOptions(page) {    
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(10, 100))
        await this.mouseRandomMove(page);     
        return new ProductGetVariationOptions(page).handle();
      };

      async extractAllVariations(page) {
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(980, 4300))
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
        await this.humanNavigates.mouseRandomMoveAllScreen(page, [1, 6], [2, 5]);
      }

      async ofuscateBotBrowser(page){
        return this.hideBotTool.customAddInitScript(page);
      }

}

