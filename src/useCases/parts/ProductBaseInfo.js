
module.exports = class ProductBaseInfo {

    constructor(page) {        
        this.page = page;
    }

    async handle() {
        const productTitleLocator = this.page.locator('.ui-pdp-title');
        const productPriceLocator = this.page.locator('.andes-money-amount--cents-superscript').locator('meta[itemprop="price"]');
        const priceContent = await productPriceLocator.getAttribute('content');
        const producCurrencyLocator = this.page.locator('.andes-money-amount--cents-superscript').locator('.andes-money-amount__currency-symbol').first();
        
        return {
            title: await productTitleLocator.innerText(),
            price: await priceContent,
            currency: await producCurrencyLocator.innerText(),
          };
    }
    

}