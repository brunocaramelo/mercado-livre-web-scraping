
module.exports = class ProductFullDescription {

    constructor(page) {        
        this.page = page;
    }

    async handle() {
        const descriptionElement = this.page.locator('.ui-pdp-description__content');
        if (!descriptionElement) return null;
        
        return {
        text: await descriptionElement.innerText(),
        html: await descriptionElement.innerHTML()
        };
    }
    

}