const fs = require('fs');
const path = require('path');

module.exports = class FactoryProxyBrowser {
  
  
    async getInstance(){
    
        return this.getInstanceFreeProxyFromJson();
        
    }

    async getInstanceFreeProxyFromJson(){
        const proxiesFilePath = path.resolve(__dirname, '../build-cache/static/valid-proxies.json');

        try {
            const fileContent = fs.readFileSync(proxiesFilePath, 'utf-8');

            const proxies = JSON.parse(fileContent);

            if (proxies.length === 0) {
                console.log('A lista de proxies está vazia.');
            } else {
                const randomIndex = Math.floor(Math.random() * proxies.length);

                const selectedProxy = proxies[randomIndex];

                return {
                    type: selectedProxy.type,
                    ip: selectedProxy.ip,
                    port: selectedProxy.port
                };
            }
        } catch (error) {
            console.error(`Erro ao ler o arquivo: ${error.message}`);
        }
    }

    async getRandbomUserAgent(){
        const filePath = path.join(__dirname, '../buil-cache/static/random-useragents.json');
        try {
        const data = fs.readFileSync(filePath, "utf8");
        const products = JSON.parse(data);

        if (!Array.isArray(products)) {
            throw new Error("O JSON não contém uma lista de produtos válida.");
        }

        const randomIndex = Math.floor(Math.random() * products.length);
        const randomProduct = products[randomIndex].link;

        return randomProduct;
        } catch (err) {
        console.error("Erro ao ler ou processar o arquivo:", err.message);
        }
    }
}