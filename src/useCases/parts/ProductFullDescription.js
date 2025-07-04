
module.exports = class ProductFullDescription {

    constructor(page) {        
        this.page = page;
    }

    async handle() {

        console.log('('+this.constructor.name+') starting process');

        const descriptionElement = this.page.locator('.ui-pdp-description__content');
        if (!descriptionElement) return null;
        
        console.log('('+this.constructor.name+') ending process');

        return {
            text: await descriptionElement.innerText(),
            html: await descriptionElement.innerHTML()
        };
    }
    

}