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
    await this.processVariationsIterative(groups, [], results, this.page.url());

    this.logger.info((new Date()).toISOString() + ` (${this.constructor.name}) ending process`);
    return results;
  }

  async getVariationGroups() {
    return await this.page.$$eval('.ui-pdp-variations__picker', groups =>
      groups.map(group => {
        const labelElem = group.querySelector('.ui-pdp-variations__label');
        const container = group.querySelector('.ui-pdp-variations__picker-default-container');

        const label = labelElem ? labelElem.innerText.trim().split(':')[0].trim() : '';

        const options = container ?
          Array.from(container.querySelectorAll('a')).map(a => {
            const labelInner = a.querySelector('.ui-pdp-thumbnail__label');
            return {
              text: labelInner ? labelInner.innerText.trim() : (a.innerText || '').trim(),
              ariaLabel: a.getAttribute('aria-label') || '',
              href: a.getAttribute('href') || ''
            };
          }) : [];

        return { label, options };
      })
    );
  }

  async processVariationsIterative(groups, currentPath, results, baseUrl, groupIndex = 0) {
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
      const snapshotUrl = this.page.url();

      try {
        const groupLocator = this.page.locator('.ui-pdp-variations__picker').filter({
          has: this.page.locator('.ui-pdp-variations__label', { hasText: group.label })
        });

        const optionLocator = groupLocator.locator('a', {
          has: this.page.locator('.ui-pdp-thumbnail__label', { hasText: option.text })
        }).first();

        const count = await optionLocator.count();
        if (count === 0) {
          this.logger.warn(`Opção não encontrada no DOM: ${group.label} -> ${option.text}`);
          continue;
        }

        let clicked = false;
        try {
          await optionLocator.click({ timeout: 1500 });
          clicked = true;
          this.logger.info(`Clicado (normal) na opção: ${option.text}`);
        } catch (errClick) {
          this.logger.warn(`click padrão falhou para "${option.text}", tentando alternativas...`);
        }

        // if (!clicked) {
        //     try {
        //         const elHandle = await optionLocator.elementHandle();
        //         if (elHandle) {
        //             await elHandle.evaluate(el => el.click());
        //             clicked = true;
        //             this.logger.info(`Clicado (evaluate) na opção: ${option.text}`);
        //         }
        //     } catch (errEval) {
        //         this.logger.warn(`evaluate click falhou para "${option.text}"`);
        //     }
        // }

        if (!clicked) {
          try {
            const href = await optionLocator.getAttribute('href');
            if (href && href.trim()) {
              const newUrl = new URL(href, this.page.url()).toString();
              await this.page.goto(newUrl, { timeout: 8000 });
              clicked = true;
              this.logger.info(`Navegado via href para: ${newUrl}`);
            }
          } catch (errHref) {
            this.logger.warn(`fallback href falhou para "${option.text}"`);
          }
        }

        if (!clicked) {
          this.logger.error(`Não foi possível ativar opção: ${option.text}`);
          continue; 
        }

        try {
          if ((await this.page.url()) !== snapshotUrl) {
            await this.page.waitForNavigation({ timeout: 5000 }).catch(() => {});
          } else {
            await this.page.waitForLoadState('networkidle', { timeout: 2000 }).catch(() => {});
            const selectedLabelLocator = this.page.locator('.ui-pdp-variations__selected-label', { hasText: option.text });
            await selectedLabelLocator.waitFor({ timeout: 1500 }).catch(() => {});
          }
        } catch (waitErr) {
          this.logger.warn(`Espera pós-clique limitada para "${option.text}" terminou: ${waitErr.message || waitErr}`);
        }

        const newGroups = await this.getVariationGroups();

        await this.processVariationsIterative(newGroups, [...currentPath, { label: group.label, value: option.text }], results, baseUrl, groupIndex + 1);

        if (snapshotUrl && snapshotUrl !== this.page.url()) {
          try {
            await this.page.goto(snapshotUrl, { timeout: 7000 });
            await this.page.waitForLoadState('networkidle', { timeout: 2000 }).catch(() => {});
          } catch (errGoto) {
            this.logger.warn(`Não foi possível voltar para URL anterior: ${snapshotUrl} -> ${errGoto.message || errGoto}`);
          }
        } else {
          await this.page.waitForTimeout(this.numbersTools.randomIntFromInterval(300, 900));
        }

      } catch (error) {
        this.logger.error(`Erro ao processar ${group.label}: ${option.text}`, error && (error.message || error));
        continue;
      }
    }
  }

};
