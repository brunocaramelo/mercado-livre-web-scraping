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

    async emulateGoogleSearch(txt) {        
       
       const encode = txt => encodeURIComponent(txt);

        const sca_esv = Math.random().toString(16).slice(2);
        const sxsrf   = Math.random().toString(36).slice(2) + ":" + Date.now();
        const ei      = Math.random().toString(36).slice(2, 15);

        const params = new URLSearchParams({
            q: query,
            sca_esv: sca_esv,
            hl: "pt_BR",
            sxsrf: sxsrf,
            ei: ei,
            oq: query.substring(0, Math.max(5, query.length - 5)),
            sclient: "gws-wiz-serp"
        });

        return "https://www.google.com/search?" + params.toString();
            
    }
}