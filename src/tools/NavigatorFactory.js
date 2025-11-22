const fs = require('fs');
const path = require('path');
const randbomProxy = require('./FactoryProxyBrowser');
const FactoryProxyBrowser = require('./FactoryProxyBrowser');
class NavigatorFactory {
  constructor() {
    this.browserInstance = null;
    this.contextInstance = null;
    this.factoryProxyBrowser = new FactoryProxyBrowser();

    this.statePath = path.resolve(process.env.PLAYWRIGHT_STATE_PATH || 'ml_state.json');
  }

  async launchAndContexthStrategy(navigatorInst) {
    const launched = await this.launchStrategy(navigatorInst);

    this.browserInstance = launched;

    const userAgentChoiced = this.factoryProxyBrowser.getRandbomUserAgent();

    this.contextInstance = await launched.newContext({
      storageState: this._loadState(),
      userAgent: userAgentChoiced.userAgent
    });

    return this.contextInstance;
  }

  async launchStrategy(navigator) {

    const useProxyConfig = process.env.USE_PROXY_TO_REQUESTS == 'true';
   

    let optionsLaunch = {
      headless: false,
      args: ['--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor']
    };

    if (useProxyConfig) {

      console.log((new Date()).toISOString()+'(launchStrategy) aplicando proxy: '+proxyIpPort);

      optionsLaunch.proxy = {
            server: process.env.CONFIG_PROXY_SERVER,
            username: process.env.CONFIG_PROXY_USERNAME,
            password: process.env.CONFIG_PROXY_PASSWORD
        }
    }

    return await this.launchWithOptionsParam(navigator, optionsLaunch);
  }

  async launchWithOptionsParam(navigator, optionsLaunch) {
    return await navigator.launch(optionsLaunch);
  }

  async launchWithOptionsParamContext(navigator, optionsLaunch) {
    const launched = await this.launchWithOptionsParam(navigator, optionsLaunch);
    
    this.browserInstance = launched;

    const userAgentChoiced = this.factoryProxyBrowser.getRandbomUserAgent();

    this.contextInstance = await launched.newContext({
      storageState: this._loadState(),
      userAgent: userAgentChoiced.userAgent
    });
   
    return this.contextInstance;
  }

  async close() {
     try {
      await this.closeContextAndState();
      await this.closeBrowser();
    } catch(e) {
      console.error('Erro ao fechar navegador:', e.message);
    }
  }

  async closeContextAndState() {
    if (!this.contextInstance) return;

    try {
      await this.contextInstance.storageState({ path: this.statePath });
    } catch (err) {
      console.error('(NavigatorFactory) erro ao salvar storageState:', err);
    }

    await this.closeContext();
  }

  async closeContext() {
    if (!this.contextInstance) return;
    await this.contextInstance.close();
  }

  async closeBrowser() {
    if (this.browserInstance) {
      await this.browserInstance.close();
    }
  }

  _loadState() {
    if (fs.existsSync(this.statePath)) {
      try {
        return JSON.parse(fs.readFileSync(this.statePath, 'utf-8'));
      } catch (err) {
        console.error('(NavigatorFactory) erro ao ler storageState, iniciando vazio:', err);
      }
    }
    return { cookies: [], origins: [] };
  }
}

module.exports = NavigatorFactory;
