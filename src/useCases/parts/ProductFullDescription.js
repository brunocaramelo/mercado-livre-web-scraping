const Logger = require('../../tools/Logger');
module.exports = class ProductFullDescription {

    constructor(page) {        
        this.page = page;
        this.logger = new Logger();

    }

    async handle() {

        this.logger.info(new Date().toISOString()+' ('+this.constructor.name+') starting process');
        console.log(new Date().toISOString()+' ('+this.constructor.name+') starting process');

        const descriptionComplementElement = this.page.locator('.ui-pdp-description__content');
        const descriptionSmallElement = this.page.locator('.ui-pdp-container__row--highlighted-features');

        const hasComplement = await descriptionComplementElement.count() > 0;
        const hasSmall = await descriptionSmallElement.count() > 0;

        this.logger.info(new Date().toISOString()+' ('+this.constructor.name+') ending process');
        console.log(new Date().toISOString()+' ('+this.constructor.name+') ending process');

        return {
            complement: hasComplement ? {
                text: await descriptionComplementElement.innerText(),
                html: await descriptionComplementElement.innerHTML()
            } : {
                text: null,
                html: null
            },

            small: hasSmall ? {
                text: await descriptionSmallElement.innerText(),
                html: await descriptionSmallElement.innerHTML()
            } : {
                text: null,
                html: null
            },
        };
    }
    

}