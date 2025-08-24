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
      }
    };

    return await this.launchWithOptionsParam(navigator, optionsLaunch);
  }

  async launchWithOptionsParam(navigator, optionsLaunch) {
    return await navigator.launch(optionsLaunch);
  }

  async launchWithOptionsParamContext(navigator, optionsLaunch) {
    const launched = await this.launchWithOptionsParam(navigator, optionsLaunch);
   
    this.contextInstance = await launched.newContext({
      storageState: this._loadState(),
    });
   
    return this.contextInstance;
  }

  async close() {
    if (!this.contextInstance) return;

    try {
      await this.contextInstance.storageState({ path: this.statePath });
    } catch (err) {
      console.error('(NavigatorFactory) erro ao salvar storageState:', err);
    }

    if (process.env.USE_SPECIFIC_PROFILE === 'true') {
      await this.contextInstance.close();
    } else {
      await this.contextInstance.close();
      if (this.browserInstance) {
        await this.browserInstance.close();
      }
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
