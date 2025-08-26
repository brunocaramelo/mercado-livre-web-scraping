const ProductBaseInfo = require('./ProductBaseInfo');
const ProductCurrentImages = require('./ProductCurrentImages');
const WaitingFor = require('../../tools/WaitingFor');
const NumbersTools = require('../../tools/Numbers');
const HumanNavigates = require('../../tools/HumanNavigates');
const ProductFullDescription = require('./ProductFullDescription');

module.exports = class ProductAsyncExtractAllVariations {
  constructor(page, combinationsInput) {
    this.page = page;
    this.combinationsInput = combinationsInput; 
    this.doDelay = new WaitingFor();
    this.numbersTools = new NumbersTools();
    this.humanNavigates = new HumanNavigates();
  }

  async handle() {
    console.log(`(${this.constructor.name}) starting process`);

    if (!this.combinationsInput || this.combinationsInput.length === 0) {
      return [];
    }

    const variations = [];

    for (const combination of this.combinationsInput.filter(c => c.available)) {
      console.log(
        (new Date()).toISOString() +
          ` (ProductAsyncExtractAllVariations) visitando: ${combination.url}`
      );

      await this.humanNavigates.mouseRandomMoveAllScreen(this.page, [1, 4], [2, 8]);

      await this.page.goto(combination.url, {
        waitUntil: 'domcontentloaded',
        timeout: 120000 
      });

      await this.page.waitForTimeout(
        this.numbersTools.randomIntFromInterval(900, 1500)
      );

      const currentInfo = await new ProductBaseInfo(this.page).handle();
      const currentImages = await new ProductCurrentImages(this.page).handle();
      const description = await  new ProductFullDescription(this.page).handle();


      variations.push({
        attributes: combination.combination.map(opt => [
            { label: opt.label },
            { value: opt.value }
        ]),
        combination: combination.combination,
        description,
        title: currentInfo.title,
        price: {
          current: currentInfo.price,
          currency: currentInfo.currency,
        },
        images: currentImages,
        available: true,
        url: this.page.url()
      });
    }

    console.log(`(${this.constructor.name}) ending process`);
    return variations;
  }
};
