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

    this.contextInstance = await launched.newContext({
      storageState: this._loadState(),
      userAgent: this.factoryProxyBrowser.getRandbomUserAgent().userAgent
    });

    return this.contextInstance;
  }

  async launchStrategy(navigator) {

    const proxyIpPortGet = await this.factoryProxyBrowser.getInstance();

    const proxyIpPort = proxyIpPortGet.type+'://'+proxyIpPortGet.ip+':'+proxyIpPortGet.port;

    console.log((new Date()).toISOString()+'(launchStrategy) aplicando proxy: '+proxyIpPort);
    
    let optionsLaunch = {
      headless: false,
       proxy: {
        server: proxyIpPort,
      },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };

    return await this.launchWithOptionsParam(navigator, optionsLaunch);
  }

  async launchWithOptionsParam(navigator, optionsLaunch) {
    return await navigator.launch(optionsLaunch);
  }

  async launchWithOptionsParamContext(navigator, optionsLaunch) {
    const launched = await this.launchWithOptionsParam(navigator, optionsLaunch);
    
    this.browserInstance = launched;

    this.contextInstance = await launched.newContext({
      storageState: this._loadState(),
      userAgent: this.factoryProxyBrowser.getRandbomUserAgent().userAgent
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
