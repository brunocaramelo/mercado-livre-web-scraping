const ProductBaseInfo = require('./ProductBaseInfo');
const ProductCurrentImages = require('./ProductCurrentImages');
const WaitingFor = require('../../tools/WaitingFor');
const NumbersTools = require('../../tools/Numbers');
const HumanNavigates = require('../../tools/HumanNavigates');
const ProductFullDescription = require('./ProductFullDescription');
const ProductSpecifications = require('./ProductSpecifications');
const Logger = require('../../tools/Logger');

module.exports = class ProductAsyncExtractAllVariations {
  constructor(page, combinationsInput) {
    this.page = page;
    this.combinationsInput = combinationsInput; 
    this.doDelay = new WaitingFor();
    this.numbersTools = new NumbersTools();
    this.humanNavigates = new HumanNavigates();
    this.logger = new Logger();
  }

  async handle() {
    this.logger.info(`(${this.constructor.name}) starting process`);

    if (!this.combinationsInput || this.combinationsInput.length === 0) {
      return [];
    }

    const variations = [];

    for (const combination of this.combinationsInput.filter(c => c.available)) {
      this.logger.info(
        (new Date()).toISOString() +
          ` (ProductAsyncExtractAllVariations) visitando: ${combination.url}`
      );
      

      await this.humanNavigates.mouseRandomMoveAllScreen(this.page, [1, 4], [2, 8]);

      await this.page.goto(combination.url, {
        waitUntil: 'domcontentloaded',
        timeout: 120000 
      });

      await this.page.waitForTimeout(
        this.numbersTools.randomIntFromInterval(1200, 2300)
      );

      const currentInfo = await new ProductBaseInfo(this.page).handle();
      const currentImages = await new ProductCurrentImages(this.page).handle();
      const description = await  new ProductFullDescription(this.page).handle();
      const specifications = await  new ProductSpecifications(this.page).handle();


      variations.push({
        attributes: combination.combination.map(opt => [
            { label: opt.label },
            { value: opt.value }
        ]),
        combination: combination.combination,
        description,
        specifications,
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

    this.logger.info(`(${this.constructor.name}) ending process`);
    return variations;
  }
};
