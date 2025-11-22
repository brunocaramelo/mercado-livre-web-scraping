const fs = require('fs');
const path = require('path');

module.exports = class Logger {
    
    constructor() {
        this.logDir = path.join(process.cwd(), 'log');
        this.logFile = path.join(this.logDir, 'app.log');

        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    write(message) {

        if(process.env.LOG_IN_FILE == 'true'){
            return false;
        }

        const timestamp = new Date().toISOString();
        const line = `[${timestamp}] ${message}\n`;

        fs.appendFile(this.logFile, line, (err) => {
            if (err) {
                console.error('Erro ao escrever no log:', err);
            }
        });
    }

    info(msg) {
        console.log(msg)
        this.write(`INFO: ${msg}`);
    }

    warn(msg) {
        console.log(msg)
        this.write(`WARN: ${msg}`);
    }

    error(msg) {
        console.error(msg)
        this.write(`ERROR: ${msg}`);
    }
}
