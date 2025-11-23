const NumbersTools = require('./Numbers');

module.exports = class HideBotTool {
  
    constructor() {
        this.numbersTools = new NumbersTools();
    }

    async customAddInitScript(page){
        return page.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });

            Object.defineProperty(navigator, 'plugins', {
                get: () => [
                    { name: "Chrome PDF Plugin" },
                    { name: "Chrome PDF Viewer" },
                    { name: "Native Client" }
                ]
            });

            Object.defineProperty(navigator, 'mimeTypes', {
                get: () => [{ type: "application/pdf" }]
            });

            Object.defineProperty(navigator, 'languages', {
                get: () => ['pt-BR', 'pt', 'en-US']
            });

            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function (p) {
                if (p === 37445) return "NVIDIA Corporation";
                if (p === 37446) return "NVIDIA GeForce RTX 3060";
                return getParameter.apply(this, [p]);
            };

            navigator.permissions.query = (params) => {
                if (params.name === "notifications") {
                    return Promise.resolve({ state: "denied" });
                }
                return Promise.resolve({ state: "prompt" });
            };

            Object.defineProperty(navigator, "hardwareConcurrency", {
                get: () => [4, 6, 8][Math.floor(Math.random() * 3)]
            });

            Object.defineProperty(navigator, "deviceMemory", {
                get: () => [4, 8, 16][Math.floor(Math.random() * 3)]
            });

        });
    }


    randomDeviceProfile() {
        const viewports = [
            { width: 1366, height: 768 },
            { width: 1920, height: 1080 },
            { width: 1536, height: 864 },
            { width: 1440, height: 900 },
            { width: 1600, height: 900 },
        ];

        const randomViewport = viewports[Math.floor(Math.random() * viewports.length)];

        return {
            viewport: randomViewport,
            timezoneId: "America/Sao_Paulo",
            userAgent:
                [
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15"
                ][Math.floor(Math.random() * 3)]
        };
    }

   

    
}