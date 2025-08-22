
module.exports = class ProductBaseInfo {

    constructor(page) {        
        this.page = page;
    }

    async handle() {

        console.log('('+this.constructor.name+') starting process');

        try {

            const productTitleLocator = this.page.locator('.ui-pdp-title');
            const productPriceLocator = this.page.locator('.andes-money-amount--cents-superscript').locator('meta[itemprop="price"]');
            const priceContent = await productPriceLocator.getAttribute('content');
            const producCurrencyLocator = this.page.locator('.andes-money-amount--cents-superscript').locator('.andes-money-amount__currency-symbol').first();
            
            console.log('('+this.constructor.name+') ending process');

            return {
                title: await productTitleLocator.innerText(),
                price: await priceContent,
                currency: await producCurrencyLocator.innerText(),
            };

        } catch (err) {

            console.error("(" + this.constructor.name + ") erro ao extrair dados:",err.message);

            return [
                {
                    title: "Título não encontrado",
                    price: "0.00",
                    currency: "BRL",
                },
            ];
        }
    }
    

}