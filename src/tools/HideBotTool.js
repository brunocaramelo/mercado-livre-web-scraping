const NumbersTools = require('./Numbers');

module.exports = class HideBotTool {
  
    constructor() {
        this.numbersTools = new NumbersTools();
    }

    async customAddInitScript(page){
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3],
            });
            Object.defineProperty(navigator, 'languages', {
                get: () => ['pt-BR', 'pt', 'en-US', 'en'],
            });
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false
            });
        });

        return page;
    }

    
}