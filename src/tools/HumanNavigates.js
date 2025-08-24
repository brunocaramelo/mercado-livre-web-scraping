const NumbersTools = require('./Numbers');

module.exports = class HumanNavigates {
  
    constructor() {
        this.numbersTools = new NumbersTools();
    }

    async mouseRandomMove(page, xCoord, yCoord, options){
        await page.mouse.move(xCoord, 
                              yCoord, 
                              options
                            );
    }

    async mouseRandomMoveAllScreen(page, arrPreClick, arrPostClick){
        const preClickMoves = this.numbersTools.randomIntFromInterval(arrPreClick[0], arrPreClick[1]);
       
        for (let i = 0; i < preClickMoves; i++) {
            await page.mouse.move(this.numbersTools.randomIntFromInterval(1, 700),
                                this.numbersTools.randomIntFromInterval(11, 990),
                                {steps: this.numbersTools.randomIntFromInterval(7, 23)});
        }

        await page.mouse.down();

        const postClickMoves = this.numbersTools.randomIntFromInterval(arrPostClick[0], arrPostClick[1]);
        for (let i = 0; i < postClickMoves; i++) {
            await page.mouse.move(this.numbersTools.randomIntFromInterval(1, 700),
                                this.numbersTools.randomIntFromInterval(11, 990),
                                {steps: this.numbersTools.randomIntFromInterval(7, 23)});
        }

        await page.mouse.up();
        
        await page.waitForTimeout(this.numbersTools.randomIntFromInterval(200, 700));

        await page.evaluate(() => window.scrollTo(0, 0));
    }

    async  extractRandomWords(url) {        
        if (url.startsWith("https://www.mercadolivre.com.br")) {
            const path = new URL(url).pathname.split("/")[1];

            const words = path.split("-");
            if (words.length === 0) return null;

            const count = Math.floor(Math.random() * 3) + 1;

            const selected = words.slice(-count);

            return {
                slug: selected.join("-"),
                notSlug: selected.join("")
            };
        }

        if (!url.startsWith("https://produto.mercadolivre.com.br")) {

            const path = new URL(url).pathname;

            const match = path.match(/MLB-\d+-(.+)/);
            if (!match) return null;

            let slug = match[1];

            slug = slug.replace(/_.+$/, "");

            const words = slug.split("-");
            if (words.length === 0) return null;

            const count = Math.floor(Math.random() * 3) + 1;

            const selected = words.slice(-count);

            return {
                slug: selected.join("-"),
                notSlug: selected.join("")
            };
        }
        
    }
}