
const ProductBaseInfo = require('./ProductBaseInfo');
const ProductCurrentImages = require('./ProductCurrentImages');
const ProductGetVariationOptions = require('./ProductGetVariationOptions');
const WaitingFor = require('../../tools/WaitingFor');

module.exports = class ProductAsyncExtractAllVariations {

    constructor(page, pageDataInitial) {        
        this.page = page;
        this.pageDataInitial = pageDataInitial;
        this.doDelay = new WaitingFor();
    }

    async handle() {

      const variationGroups = await new ProductGetVariationOptions(this.page).handle();
     
      if (variationGroups.length < 2) return [];

      const [firstGroup, secondGroup] = variationGroups;
      const variations = [];

      const baseImages = this.pageDataInitial.baseImages;
      const baseInfo = this.pageDataInitial.baseInfo;
      const baseDescription = this.pageDataInitial.baseDescription;
      const baseSpecs = this.pageDataInitial.baseSpecs;

      for (const firstOption of firstGroup.options.filter(opt => opt.available)) {
        await this.page.goto(firstOption.href, {
          waitUntil: 'domcontentloaded',
          timeout: 600000
        });
        
        this.doDelay.rangeMicroseconds(91, 102);

        for (const secondOption of secondGroup.options.filter(opt => opt.available)) {
          await this.page.goto(secondOption.href, {
            waitUntil: 'domcontentloaded',
            timeout: 600000
          });

          this.doDelay.rangeMicroseconds(99, 114);

          const currentInfo = await new ProductBaseInfo(this.page).handle();
          const currentImages = await new ProductCurrentImages(this.page).handle();

          variations.push({
            attributes: [
              [
                { label: firstGroup.label, value: firstOption.label },
                { text: firstGroup.text, value: firstOption.text }
              ], [
                { label: secondGroup.label, value: secondOption.label },
                { text: secondGroup.text, value: secondOption.text }
              ]
            ],
            title: currentInfo.title,
            price: {
              current: currentInfo.price,
              currency: currentInfo.currency,
            },
            images: currentImages,
            available: true
          });
        }
      }

      // if (variations.length > 0) {
      //   // firstGroup.options[0].element.click();
      //   // await waitForChanges();
      //   await this.page.goto(firstGroup.options[0].href, {
      //     waitUntil: 'domcontentloaded',
      //     timeout: 600000
      //   });

      //   // secondGroup.options[0].element.click();
      //   // await waitForChanges();

      //   await this.page.goto(secondGroup.options[0].href, {
      //     waitUntil: 'domcontentloaded',
      //     timeout: 600000
      //   });

      // }

      return variations;
    }


    

}