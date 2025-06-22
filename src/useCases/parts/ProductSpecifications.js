
module.exports = class ProductSpecifications {

    constructor(page) {        
        this.page = page;
    }

    async handle() {

      const specSections = await this.page.$$eval(
        'div.ui-vpp-highlighted-specs__striped-specs div.ui-vpp-striped-specs__table',
        tables => tables.map(table => {

          const titleEl = table.querySelector('h3.ui-vpp-striped-specs__header');
          const title = titleEl ? titleEl.innerText.trim() : null;
      

          const rows = Array.from(table.querySelectorAll('tr')).map(tr => {
            const th = tr.querySelector('th .andes-table__header__container');
            const td = tr.querySelector('td .andes-table__column--value');
            const label = th ? th.innerText.trim() : null;
            const value = td ? td.innerText.trim() : null;

            return label && value ? { label, value } : null;
          }).filter(Boolean);
      
          return { title, rows };
        })
      );
      
      return specSections;
    }
    

}