const WaitingFor = require('../../tools/WaitingFor');
const NumbersTools = require('../../tools/Numbers');
const HumanNavigates = require('../../tools/HumanNavigates');
const Logger = require('../../tools/Logger');

module.exports = class ProductCurrentImages {

    constructor(page) {        
        this.page = page;
        this.doDelay = new WaitingFor();
        this.numbersTools = new NumbersTools();
        this.humanNavigates = new HumanNavigates();
        this.logger = new Logger();
    }

    async handle() {
      
      this.logger.info((new Date()).toISOString()+' ('+this.constructor.name+') starting process');

      let imageList = [];

      const wrappers = await this.page.$$('.ui-pdp-gallery__wrapper');

      for (let i = 0; i < wrappers.length; i++) {

        await this.humanNavigates.mouseRandomMoveAllScreen(this.page, [1, 4], [2, 7]);
        
        await this.page.waitForTimeout(this.numbersTools.randomIntFromInterval(500, 1300))


        const wrapper = wrappers[i];

        const thumbBtn = await wrapper.$('button.ui-pdp-thumbnail__picture');
        const thumbImg = await thumbBtn.$('img');
        const thumbSrc = await thumbImg.getAttribute('src');
               
        // await thumbBtn.click(); 
        
        await this.page.waitForTimeout(20);

        const fullImage = await wrapper.$('figure.ui-pdp-gallery__figure img.ui-pdp-gallery__figure__image');

        const fullSrc = await fullImage?.getAttribute('data-zoom');
        const midSrc = await fullImage?.getAttribute('src');
        
        if (typeof fullSrc === 'undefined') {
          continue;
        }
       
        imageList.push({
          thumbnail: thumbSrc,
          mid_size: midSrc,
          full_size: fullSrc,
        });
      }

      this.logger.info((new Date()).toISOString()+' ('+this.constructor.name+') ending process');

      return imageList;

    }
    

}