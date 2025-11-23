const NumbersTools = require('../../tools/Numbers');
const Logger = require('../../tools/Logger');
const ProductVariationExtractDataCurrentPage = require('./ProductVariationExtractDataCurrentPage');

module.exports = class ProductProcesVariationOptions {

  constructor(page) {
    this.page = page;
    this.numbersTools = new NumbersTools();
    this.logger = new Logger();
  }

  async getCurrentBaseUrl() {
    const currentUrl = await this.page.url();
    const url = new URL(currentUrl);
    return `${url.protocol}//${url.hostname}`;
  }

  async handle() {
    this.logger.info((new Date()).toISOString() + ` (${this.constructor.name}) starting process`);

    const results = [];

    const groups = await this.getVariationGroups();

    this.logger.info(groups);

    await this.processVariationsIterativeExtract();

    this.logger.info((new Date()).toISOString() + ` (${this.constructor.name}) ending process`);
    return results;
  }

  async getVariationGroups() {
      return await this.page.$$eval('.ui-pdp-variations__picker', groups =>
          groups.map(group => {
              const labelElem = group.querySelector('.ui-pdp-variations__label');
              const container = group.querySelector('.ui-pdp-variations__picker-default-container');
              
              const label = labelElem ? labelElem.innerText.replace(':','').trim() : '';
              const options = [];

              container?.querySelectorAll('a')?.forEach(a => {
                  const text = a.querySelector('.ui-pdp-thumbnail__label')?.innerText.trim()
                              || a.innerText.trim();
                  const href = a.getAttribute('href');
                  if (text && href) options.push({ text, href });
              });

              return { label, options };
          })
      );
  }

  async processVariationsIterativeExtract() {
    const results = [];

    let groups = await this.getVariationGroups();
    const totalGroups = groups.length;

    const indexes = Array(totalGroups).fill(0);

    while (true) {
        let valid = true;

        for (let i = 0; i < totalGroups; i++) {
            const group = groups[i];
            const option = group.options[indexes[i]];

            if (!option) { valid = false; break; }

            const targetUrl = new URL(option.href, this.page.url()).toString();
            await this.page.goto(targetUrl, { timeout: 8000 });

            groups = await this.getVariationGroups();
        }

        if (!valid) break;

        const extracted = await new ProductVariationExtractDataCurrentPage(this.page).handle();

        this.logger.info('(processVariationsIterativeExtract) item');
        this.logger.info({combination: groups.map((g, idx) => ({
                group: g.label,
                option: g.options[indexes[idx]].text
            })),
            data: extracted,
            url: this.page.url()});

        results.push({
            combination: groups.map((g, idx) => ({
                group: g.label,
                option: g.options[indexes[idx]].text
            })),
            data: extracted,
            url: this.page.url()
        });

        let carry = true;
        for (let i = totalGroups - 1; i >= 0 && carry; i--) {
            indexes[i]++;
            if (indexes[i] >= groups[i].options.length) {
                indexes[i] = 0;
            } else {
                carry = false;
            }
        }

        if (carry) break;
    }

    return results;
    
  }

};
