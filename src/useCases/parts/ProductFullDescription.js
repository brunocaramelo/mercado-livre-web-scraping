
module.exports = class ProductFullDescription {

    constructor(page) {        
        this.page = page;
    }

    async handle() {

        console.log((new Date()).toISOString()+' ('+this.constructor.name+') starting process');

        const descriptionComplementElement = this.page.locator('.ui-pdp-description__content');
        const descriptionSmallElement = this.page.locator('.ui-pdp-container__row--highlighted-features');
        
        console.log((new Date()).toISOString()+' ('+this.constructor.name+') ending process');

        return {
            complement: {
                text: await descriptionComplementElement?.innerText() ?? null,
                html: await descriptionComplementElement?.innerHTML() ?? null
            },
            small: {
                text: await descriptionSmallElement?.innerText() ?? null,
                html: await descriptionSmallElement?.innerHTML() ?? null
            },
        };
    }
    

}