const NumbersTools = require('../../tools/Numbers');
const Logger = require('../../tools/Logger');
const ProductVariationExtractDataCurrentPage = require('./ProductVariationExtractDataCurrentPage');

module.exports = class ProductProcesVariationOptions {

  constructor(page) {
    this.page = page;
    this.numbersTools = new NumbersTools();
    this.logger = new Logger();
    this.visited = new Set();
    this.queue = []; 
  }

  async getCurrentBaseUrl() {
    const currentUrl = await this.page.url();
    const url = new URL(currentUrl);
    return `${url.protocol}//${url.hostname}`;
  }

  async handle() {
    this.logger.info((new Date()).toISOString() + ` (${this.constructor.name}) starting process`);

    let results = [];
 
    const groups = await this.getVariationGroups();

    const hasNotVariationsInProduct = (!Array.isArray(groups) || groups.length === 0)

    this.logger.info("Checando existencia de variações: "+(hasNotVariationsInProduct ? 'NAO': 'SIM'));

    if (hasNotVariationsInProduct) {
      return results;
    }

    this.logger.info(JSON.stringify(groups));

    results = await this.processVariationsIterativeExtract();

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
      this.logger.info("Iniciando varredura dinâmica de variações...");

      const results = [];

      const baseUrl = await this.getCurrentBaseUrl();
      const startUrl = this.formatCleaningProductUrl(await this.page.url());

      this.logger.info(`URL inicial: ${startUrl}`);

      this.queue.push(startUrl);

      let attrListJson = [];

      while (this.queue.length > 0) {
      
        const currentUrl = this.formatCleaningProductUrl(this.queue.shift());

        if (this.visited.has(currentUrl)) {
          continue;
        }

        this.visited.add(currentUrl);
        this.logger.info(`→ Visitando: ${currentUrl}`);
       
        try {
          await this.page.goto(currentUrl, {
            timeout: 45000,
            waitUntil: "domcontentloaded"
          });
        } catch (err) {
          this.logger.error("ERRO no goto(): " + err.message);
          continue; 
        }

        await this.page.waitForTimeout(this.numbersTools.randomIntFromInterval(300, 1200));

        const groups = await this.getVariationGroups();

        for (const g of groups) {
          for (const opt of g.options) {
            const nextUrl = this.formatCleaningProductUrl(baseUrl + opt.href);

            if (!this.visited.has(nextUrl)) {
              this.logger.info(`→ Descoberto novo link: ${nextUrl}`);
              this.queue.push(nextUrl);
            }
          }
        }

        const choiced = groups.flatMap(g =>
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
          key: JSON.stringify(choiced),
          extracted : extracted
        });

        this.logger.info("✔ Extraído: " + JSON.stringify({ url: currentUrl, attributes: choiced }));
        this.logger.info("Links Disponiveis Lista: " + JSON.stringify({ links_avaliable: this.queue }));
    }

    this.logger.info("FINAL: Total combinações visitadas = " + results.length);
    this.logger.info((new Date()).toISOString() + ` (${this.constructor.name}) ending process`);

    return  results
        .filter((item, index, self) => 
            index === self.findIndex(obj => obj.key === item.key)
        )
        .map(item => ({
            ...item.extracted,
        }));
  }


    generateCombinations(groups) {
      this.logger.info(`Generating combinations for ${groups.length} groups`);
      groups.forEach((group, index) => {
          this.logger.info(`Group ${index + 1} (${group.label}): ${group.options.length} options`);
      });

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
      
      this.logger.info(`Generated ${result.length} total combinations`);
      


      return result;
  }

  formatCleaningProductUrl(url)
  {
    const urlObj = new URL(url);
    const domainApp = urlObj.hostname;

    if(domainApp == 'www.mercadolivre.com.br' 
      || domainApp == 'mercadolivre.com.br' ){
        return urlObj.origin + urlObj.pathname;
    }

  }



};
