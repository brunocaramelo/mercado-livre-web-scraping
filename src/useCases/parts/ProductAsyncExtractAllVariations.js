const ProductBaseInfo = require('./ProductBaseInfo');
const ProductCurrentImages = require('./ProductCurrentImages');
const ProductGetVariationOptions = require('./ProductGetVariationOptions');
const WaitingFor = require('../../tools/WaitingFor');

module.exports = class ProductAsyncExtractAllVariations {
  constructor(page, pageDataInitial) {
    this.page = page;
    this.pageDataInitial = pageDataInitial;
    this.doDelay = new WaitingFor();
  }

  async handle() {
    console.log(`(${this.constructor.name}) starting process`);

    const variationGroups = await new ProductGetVariationOptions(this.page).handle();
    if (variationGroups.length === 0) return [];

    const variations = [];

    const processLevel = async (level, selectedOptions) => {
      if (level >= variationGroups.length) {
   
        const currentInfo = await new ProductBaseInfo(this.page).handle();
        const currentImages = await new ProductCurrentImages(this.page).handle();

        variations.push({
          attributes: selectedOptions.map((opt, idx) => [
            { label: variationGroups[idx].label, value: opt.label },
            { text: variationGroups[idx].text, value: opt.text }
          ]),
          title: currentInfo.title,
          price: {
            current: currentInfo.price,
            currency: currentInfo.currency,
          },
          images: currentImages,
          available: true
        });
        return;
      }

      const group = variationGroups[level];

      for (const option of group.options.filter(opt => opt.available)) {
        await this.page.goto(option.href, {
          waitUntil: 'domcontentloaded',
          timeout: 600000
        });

        this.doDelay.rangeMicroseconds(90 + level * 5, 110 + level * 5);

        await processLevel(level + 1, [...selectedOptions, option]);
      }
    };

    await processLevel(0, []);

    console.log(`(${this.constructor.name}) ending process`);
    return variations;
  }
};
