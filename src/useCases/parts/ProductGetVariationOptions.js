
module.exports = class ProductGetVariationOptions {

    constructor(page) {        
        this.page = page;
    }

    async handle() {
      
      console.log((new Date()).toISOString()+'('+this.constructor.name+') starting process');

      const variationGroups = [];
      const groupHandles = await this.page.$$('.ui-pdp-variations__picker');
      
      for (const groupHandle of groupHandles) {
        const rawLabel = await groupHandle.$eval(
          '.ui-pdp-variations__label',
          el => el.innerText.trim()
        );
        const label = rawLabel.split(':')[0].trim();
      
        const container = await groupHandle.$('.ui-pdp-variations__picker-default-container');
        if (!container) {
          variationGroups.push({ label, options: {} });
          continue;
        }
      
        const anchors = await container.$$('a');
        const options = [];
        
        for (const a of anchors) {
          
          const textAnchor = await a.$$('div>p');
          
          const text = await this.page.evaluate(el => el.innerText, a);
          const href = await this.page.evaluate(el => el.href, a);
          const available = true;

          options.push({ text, href, available });
        }
      
        variationGroups.push({ label, options });

      }

      console.log((new Date()).toISOString()+'('+this.constructor.name+') ending process');


      return variationGroups;    
    
    }
    

}

