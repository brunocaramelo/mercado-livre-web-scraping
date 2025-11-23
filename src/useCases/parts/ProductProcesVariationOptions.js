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

    this.logger.info(JSON.stringify(groups));

    await this.processVariationsIterativeExtract();

    this.logger.info((new Date()).toISOString() + ` (${this.constructor.name}) ending process`);
    return results;
  }

  async getVariationGroups() {
      return await this.page.$$eval('.ui-pdp-variations__picker', groups =>
          groups.map(group => {
              const labelElem = group.querySelector('.ui-pdp-variations__label');
              const container = group.querySelector('.ui-pdp-variations__picker-default-container');
              
              const rawLabel = labelElem?.innerText || "";
              const label = rawLabel.split(':')[0].trim();              

              const options = [];

              container?.querySelectorAll('a')?.forEach(a => {
                  const text = a.querySelector('.ui-pdp-thumbnail__label')?.innerText.trim()
                              || a.innerText.trim();
                  const href = a.getAttribute('href');
                  const choiced = (a.className.includes('--SELECTED') == true ? 'yes': 'no');

                  if (text && href && choiced) options.push({ text, href , choiced});
              });

              return { label, options };
          })
      );
  }

  async processVariationsIterativeExtract() {

    let fistUrlVariation = null;

    const results = [];

    const initialGroups = await this.getVariationGroups();

    const combinations = this.generateCombinations(initialGroups);

    this.logger.info("Total combinations: " + combinations.length);

    let counterItem = 0;
    let breakVariationsNavigationFinished = false; 

    for (const combo of combinations) {

        this.logger.info("[Combo] " + JSON.stringify(combo));
        
        if (breakVariationsNavigationFinished) {
          this.logger.info("Primeiro item encontrado novamente encerrando laco");
          break;
        }

        for (const item of combo) {

          if (counterItem == 0) {
            fistUrlVariation = item.href
          }
          
          if(fistUrlVariation == item.href){
            this.logger.info("Primeiro item igual ao atual : "+JSON.stringify({
              fistUrl: fistUrlVariation,
              currentUrl: item.href,
            }));
            break;
          }

          await this.page.goto(await this.getCurrentBaseUrl()+item.href, {
                timeout: 35000,
                waitUntil: "domcontentloaded"
          });

          counterItem++;
        }

        const finalGroups = await this.getVariationGroups();

        const choiced = finalGroups.flatMap(g =>
            g.options
                .filter(o => o.choiced === "yes")
                .map(o => ({
                    label: g.label,
                    value: o.text
                }))
        );

        const extracted = await new ProductVariationExtractDataCurrentPage(
            this.page,
            choiced
        ).handle();

        results.push({
            combination: choiced,
            url: this.page.url(),
            data: extracted
        });
    }

    this.logger.info("(processVariationsIterativeExtract) Expondo dados obtidos");
    this.logger.info(JSON.stringify(results));

    return results;
  }

  generateCombinations(groups) {
    const normalized = groups.map(g => ({
        label: g.label,
        options: g.options.map(o => ({
            label: g.label,
            text: o.text,
            href: o.href
        }))
    }));

    const result = [];

    const backtrack = (depth, current) => {
        if (depth === normalized.length) {
            result.push([...current]);
            return;
        }

        const group = normalized[depth];

        for (const option of group.options) {
            current.push(option);
            backtrack(depth + 1, current);
            current.pop();
        }
    };

    backtrack(0, []);

    return result;
  }



};
