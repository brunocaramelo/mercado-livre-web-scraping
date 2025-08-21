const NumbersTools = require('../tools/Numbers');

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
        const preClickMoves = numbersTools.randomIntFromInterval(arrPreClick[0], arrPreClick[1]);
       
        for (let i = 0; i < preClickMoves; i++) {
            await page.mouse.move(numbersTools.randomIntFromInterval(1, 700),
                                numbersTools.randomIntFromInterval(11, 990),
                                {steps: numbersTools.randomIntFromInterval(7, 23)});
        }

        await page.mouse.down();

        const postClickMoves = numbersTools.randomIntFromInterval(arrPostClick[0], arrPostClick[1]);
        for (let i = 0; i < postClickMoves; i++) {
            await page.mouse.move(numbersTools.randomIntFromInterval(1, 700),
                                numbersTools.randomIntFromInterval(11, 990),
                                {steps: numbersTools.randomIntFromInterval(7, 23)});
        }

        await page.mouse.up();
        
        await page.waitForTimeout(numbersTools.randomIntFromInterval(999, 1790));
    }
}