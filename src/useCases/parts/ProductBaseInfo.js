const Logger = require('../../tools/Logger');

module.exports = class ProductBaseInfo {

    constructor(page) {        
        this.page = page;
        this.logger = new Logger();
    }

    async handle() {

        this.logger.info((new Date()).toISOString()+' ('+this.constructor.name+') starting process');

        let price = null;
        let currency = null;
        
        try {

            const productTitleLocator = this.page.locator('.ui-pdp-title');
            const productPriceLocator = this.page.locator('.andes-money-amount--cents-superscript').locator('meta[itemprop="price"]');
            
            
            // const priceContent = await productPriceLocator.getAttribute('content');
            // const producCurrencyLocator = this.page.locator('.andes-money-amount--cents-superscript').locator('.andes-money-amount__currency-symbol').first();
            
            try {
                const priceCount = await productPriceLocator.count();
                if (priceCount > 0) {
                    price = await productPriceLocator.getAttribute('content');
                }

                const currencyCount = await this.page
                    .locator('.andes-money-amount--cents-superscript .andes-money-amount__currency-symbol')
                    .count();

                if (currencyCount > 0) {
                    currency = await this.page
                        .locator('.andes-money-amount--cents-superscript .andes-money-amount__currency-symbol')
                        .first()
                        .innerText();
                }

            } catch (err) {
                this.logger.error("(ProductBaseInfo) Erro ao extrair price/currency: " + err.message);
            }

            this.logger.info((new Date()).toISOString()+' ('+this.constructor.name+') ending process');

            return {
                title: await productTitleLocator.innerText(),
                price: price,
                currency: currency,
            };

        } catch (err) {

            this.logger.error("(" + this.constructor.name + ") erro ao extrair dados:",err.message);

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