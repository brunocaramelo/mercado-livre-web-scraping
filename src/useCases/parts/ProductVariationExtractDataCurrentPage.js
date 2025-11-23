const ProductBaseInfo = require('./ProductBaseInfo');
const ProductCurrentImages = require('./ProductCurrentImages');
const WaitingFor = require('../../tools/WaitingFor');
const NumbersTools = require('../../tools/Numbers');
const HumanNavigates = require('../../tools/HumanNavigates');
const ProductFullDescription = require('./ProductFullDescription');
const ProductSpecifications = require('./ProductSpecifications');
const Logger = require('../../tools/Logger');

module.exports = class ProductVariationExtractDataCurrentPage {
  constructor(page, combination) {
    this.page = page;
    this.combination = combination; 
    this.numbersTools = new NumbersTools();
    this.humanNavigates = new HumanNavigates();
    this.logger = new Logger();
  }

  async handle() {
    this.logger.info(`(${this.constructor.name}) starting process`);

    this.logger.info(
      (new Date()).toISOString() +
        ' (ProductExtractDataCurrentPage) extraindo dados da pagina : '+await page.url()
    );
    

    await this.humanNavigates.mouseRandomMoveAllScreen(this.page, [1, 4], [2, 8]);

    await this.page.waitForTimeout(
      this.numbersTools.randomIntFromInterval(300, 650)
    );

    const currentInfo = await new ProductBaseInfo(this.page).handle();
    const currentImages = await new ProductCurrentImages(this.page).handle();
    const description = await  new ProductFullDescription(this.page).handle();
    const specifications = await  new ProductSpecifications(this.page).handle();

    this.logger.info(`(${this.constructor.name}) ending process`);

    return {
        attributes: this.combination.combination.map(opt => [
            { label: opt.label },
            { value: opt.value }
        ]),
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
    };
  
  }

};
