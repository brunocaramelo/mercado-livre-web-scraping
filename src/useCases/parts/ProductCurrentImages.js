
module.exports = class ProductCurrentImages {

    constructor(page) {        
        this.page = page;
    }

    async handle() {
      
      const imageList = [];

      const thumbnailsButton = await this.page.$$('.ui-pdp-gallery__wrapper');
      
      for (const thumb of thumbnailsButton) {

        const thumbBtn = await thumb.$('button.ui-pdp-thumbnail__picture');
        const thumbImg = await thumbBtn.$('img');
        const thumbSrc = await thumbImg.getAttribute('src');

        await thumb.click();
        await this.page.waitForTimeout(20);
        
        const fullImage = await this.page.$('figure.ui-pdp-gallery__figure img');
        const fullSrc = await fullImage?.getAttribute('data-zoom');

        imageList.push({
          thumbnail: thumbSrc,
          full_size: fullSrc,
        });
      
      }

      return imageList;

    }
    

}