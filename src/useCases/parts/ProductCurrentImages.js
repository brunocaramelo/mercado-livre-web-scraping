const WaitingFor = require('../../tools/WaitingFor');

module.exports = class ProductCurrentImages {

    constructor(page) {        
        this.page = page;
        this.doDelay = new WaitingFor();
    }

    async handle() {
      
      console.log('('+this.constructor.name+') starting process');

      let imageList = [];

      const wrappers = await this.page.$$('.ui-pdp-gallery__wrapper');

      for (let i = 0; i < wrappers.length; i++) {

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
      
        console.log(imageList[i]);

      }

      console.log('('+this.constructor.name+') ending process');

      return imageList;

    }
    

}