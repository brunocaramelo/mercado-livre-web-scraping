const WaitingFor = require('../../tools/WaitingFor');

module.exports = class ProductCurrentImages {

    constructor(page) {        
        this.page = page;
        this.doDelay = new WaitingFor();
    }

    async handle() {
      
      console.log('('+this.constructor.name+') starting process');

      let imageList = [];

      const thumbnailsButton = await this.page.$$('.ui-pdp-gallery__wrapper');
      
      for (const thumb of thumbnailsButton) {

        const thumbBtn = await thumb.$('button.ui-pdp-thumbnail__picture');
        const thumbImg = await thumbBtn.$('img');
        const thumbSrc = await thumbImg.getAttribute('src');

        this.doDelay.rangeMicroseconds(110, 202);
        
        // console.log([thumbSrc])
        await thumb.click(); 
        
        await this.page.waitForTimeout(20);

        const fullImage = await this.page.$('figure.ui-pdp-gallery__figure img');
        const fullSrc = await fullImage?.getAttribute('data-zoom');
        const midSrc = await fullImage?.getAttribute('src');

        imageList.push({
          thumbnail: thumbSrc,
          mid_size: midSrc,
          full_size: fullSrc,
        });
      
      }

      console.log('('+this.constructor.name+') ending process');

      return imageList;

    }
    

}