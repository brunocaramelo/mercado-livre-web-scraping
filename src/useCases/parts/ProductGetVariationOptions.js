const NumbersTools = require('../../tools/Numbers');
const Logger = require('../../tools/Logger');

module.exports = class ProductGetVariationOptions {

  constructor(page) {
    this.page = page;
    this.numbersTools = new NumbersTools();
    this.logger = new Logger();
  }

  async handle() {
    this.logger.info((new Date()).toISOString() + ` (${this.constructor.name}) starting process`);

    const results = [];
    const groups = await this.getVariationGroups();

    await this.processVariationsIterative(groups, [], results);

    this.logger.info((new Date()).toISOString() + ` (${this.constructor.name}) ending process`);
    
    return results;
  }

  async getVariationGroups() {
    return await this.page.$$eval('.ui-pdp-variations__picker', groups => 
      groups.map(group => {
        const labelElem = group.querySelector('.ui-pdp-variations__label');
        const container = group.querySelector('.ui-pdp-variations__picker-default-container');
        
        return {
          label: labelElem ? labelElem.innerText.trim().split(':')[0].trim() : '',
          options: container ? 
            Array.from(container.querySelectorAll('a')).map(a => ({
              text: a.innerText.trim(),
              ariaLabel: a.getAttribute('aria-label') || ''
            })) : []
        };
      })
    );
  }

  async processVariationsIterative(groups, currentPath, results, groupIndex = 0) {
    if (groupIndex >= groups.length) {
      results.push({
        combination: [...currentPath],
        url: this.page.url(),
        available: true
      });
      return;
    }

    const group = groups[groupIndex];
    
    for (const option of group.options) {
      try {
        const currentUrl = this.page.url();
        
        try {
          const optionSelector = `.ui-pdp-variations__picker:nth-child(${groupIndex + 1}) a[aria-label*="${option.text}"]`;
          await this.page.click(optionSelector);
          this.logger.info(`Clicado na opção: ${option.text}`);
        } catch (error) {
            this.logger.error(`Erro ao clicar na opção "${option.text}":`, error);
        }
        
        await this.page.waitForTimeout(this.numbersTools.randomIntFromInterval(800, 1200));
        
        await this.processVariationsIterative(
          groups, 
          [...currentPath, { label: group.label, value: option.text }], 
          results, 
          groupIndex + 1
        );
        
        if (option !== group.options[group.options.length - 1]) {
          await this.page.goto(currentUrl);
          await this.page.waitForTimeout(1000);
        }
        
      } catch (error) {
        this.logger.error(`Erro ao processar ${group.label}: ${option.text}`, error.message);
        continue;
      }
    }
  }

}