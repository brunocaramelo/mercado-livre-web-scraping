const fs = require('fs');
const path = require('path');

module.exports = class RandbomProxy {
  
    constructor() {
    }

    async randProxy(){
    
        const proxiesFilePath = path.resolve('valid-proxies.json');

        try {
        const fileContent = fs.readFileSync(proxiesFilePath, 'utf-8');

        const proxies = JSON.parse(fileContent);

        if (proxies.length === 0) {
            console.log('A lista de proxies está vazia.');
        } else {
            const randomIndex = Math.floor(Math.random() * proxies.length);

            const selectedProxy = proxies[randomIndex];

            const result = `${selectedProxy.ip}:${selectedProxy.port}`;
            
            return result;
        }
        } catch (error) {
            console.error(`Erro ao ler o arquivo: ${error.message}`);
        }
    }

    
}