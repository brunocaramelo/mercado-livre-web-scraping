
module.exports = class ProductCurrentImages {

    constructor(page) {        
        this.page = page;
    }

    async handle() {
      
      return await this.page.$$eval('.ui-pdp-gallery__figure img', imgs => {
        return Array.from(imgs).map(img => ({
          thumbnail: img.src,
          full_size: img.src.replace(/s_MLB\w+/g, 'o_MLB')
        }));
      });

    }
    

}