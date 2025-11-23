const { chromium } = require('playwright-extra');
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

const ProductProcesVariationOptions = require('./parts/ProductProcesVariationOptions')

const WaitingFor = require('../tools/WaitingFor');
const NumbersTools = require('../tools/Numbers');
const HumanNavigates = require('../tools/HumanNavigates');
const HideBotTool = require('../tools/HideBotTool');
const NavigatorFactory = require('../tools/NavigatorFactory');
const Logger = require('../tools/Logger');
module.exports = class ScrapperProduct {

    constructor(productUri, productName) {
        this.productUri = productUri;
        this.productName = productName;
        this.doDelay = new WaitingFor();
        this.numbersTools = new NumbersTools();
        this.humanNavigates = new HumanNavigates();
        this.hideBotTool = new HideBotTool();
        this.navigatorFactory = new NavigatorFactory();
        this.logger = new Logger();
        
    }
    
    async handle() {
      
        console.log((new Date()).toISOString()+' ('+this.constructor.name+') starting process');

        chromium.use(stealth);

        const context = await this.navigatorFactory.launchAndContexthStrategy(chromium);
        
        const emulatedGoogleSearch = await this.humanNavigates.emulateGoogleSearch(this.productName);

        await context.setExtraHTTPHeaders({
          'origin': emulatedGoogleSearch,
        });
        
        
        let page = await context.newPage();
        
        page = await this.ofuscateBotBrowser(page);

        const returnProduct =  await this.processProductPage(page);
       
        this.logger.info((new Date()).toISOString()+' ('+this.constructor.name+') ending process');

        await this.closeSelf();

        return returnProduct;
    }

    async closeSelf() {
      await this.navigatorFactory.close();
    }

    async processProductPage(page) {

          await page.goto(this.productUri, {
              waitUntil: 'domcontentloaded',
              timeout: 900000
          });
          
          await this.checkBlockedLogin(page);

          await page.waitForSelector('.ui-pdp-title');

          await this.closeCepPopUp(page);

          await this.mouseRandomMove(page);

          await page.waitForTimeout(
            this.numbersTools.randomIntFromInterval(400, 990)
          );
          
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

          await this.mouseRandomMove(page);
          await page.waitForTimeout(
            this.numbersTools.randomIntFromInterval(900, 1610)
          );
          
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
          this.logger.info((new Date()).toISOString()+'(closeCepPopUp) started');
          
          const selector = 'button.onboarding-cp-button.andes-button.andes-button--transparent.andes-button--small[data-js="onboarding-cp-close"][data-origin="header"]';
          
          await page.waitForSelector(selector, { timeout: 5000 });
          
          const closeButton = page.locator(selector);
        
          if (await closeButton.isVisible()) {
            await closeButton.click();
            this.logger.info((new Date()).toISOString()+'(closeCepPopUp) ended');
          }
        } catch (e) {
          this.logger.info((new Date()).toISOString()+'(closeCepPopUp) not found');
        } 
      }

     async checkBlockedLogin(page) {
        const targetFailedString = '/gz/account-verification';

        const currentUrl = page.url();
        console.log((new Date()).toISOString()+'(checkBlockedLogin) Verificando se fui bloqueado pela plataforma');

        if (currentUrl.includes(targetFailedString)) {
          throw new Error('Bloqueio de login: A página de verificação de conta foi detectada.');
        }
        return true;
      }

      async getBaseInfo(page) {
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(60, 90))
        return new ProductBaseInfo(page).handle();
      };

      async getFullDescription(page) {
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(100, 442))
        await this.mouseRandomMove(page);
        return new ProductFullDescription(page).handle();
      };

      async getSpecifications(page) {
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(301, 710))
        await this.mouseRandomMove(page);
        return new ProductSpecifications(page).handle();
      };

      async getCurrentImages(page) {
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(1130, 3900))
        await this.mouseRandomMove(page);
        return new ProductCurrentImages(page).handle();
      };

      async getVariationOptions(page) {    
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(62, 120))
        return new ProductGetVariationOptions(page).handle();
      };

      async extractAllVariations(page) {
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(190, 1299))
        await this.mouseRandomMove(page);
        
        return new ProductProcesVariationOptions(page).handle();
      };

      async extractAllVariationsOld(page) {
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(190, 1299))
        await this.mouseRandomMove(page);
        const getVariationOptionsList = await this.getVariationOptions(page);
        if(getVariationOptionsList.length == 0) return [];
        
        return new ProductAsyncExtractAllVariations(page, getVariationOptionsList).handle();
      };
  
      async mouseRandomMove(page){
        await this.humanNavigates.mouseRandomMoveAllScreen(page, [1, 6], [2, 5]);
      }

      async ofuscateBotBrowser(page){
        return this.hideBotTool.customAddInitScript(page);
      }

}

