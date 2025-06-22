const ScrapperProduct = require('../../../src/useCases/ScrapperProduct');

const path = require('path'); // Importa o módulo 'path'
const fs = require('fs');

(async () => {

    const productUriIfNull = 'https://www.mercadolivre.com.br/premierpet-premier-super-premium-racas-especificas-shih-tzu-co-adulto-pequena-frango-75-kg-sacola-seca-unidade-1/p/MLB12017777';
   
    const args = process.argv.slice(2); 

    const productUriFinal = (args.length > 0 ? args[0] : productUriIfNull);

    console.log('Iniciando Extração de dados para a rota: '+productUriFinal);
    
    const productData = await new ScrapperProduct(productUriFinal).handle();

    const outputFileRelativePath = path.join(__dirname, '/output/'+productData.id+'_product_complete_data.json'); 

    fs.writeFileSync(outputFileRelativePath, JSON.stringify(productData, null, 2));

    console.log('Dados completos do produto '+productData.id+' extraídos e salvos em : '+outputFileRelativePath);

})();