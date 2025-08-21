const fs = require('fs');
const path = require('path');

class NavigatorFactory {
  constructor() {
    this.browserInstance = null;
    this.contextInstance = null;
    this.statePath = path.resolve(process.env.PLAYWRIGHT_STATE_PATH || 'ml_state.json');
  }

  async launchAndContexthStrategy(navigatorInst) {
    const launched = await this.launchStrategy(navigatorInst);

    if (process.env.USE_SPECIFIC_PROFILE === 'true') {
      // Persistente já retorna o contexto
      this.contextInstance = launched;
      return this.contextInstance;
    }

    // Não persistente → cria contexto com state
    this.browserInstance = launched;
    this.contextInstance = await launched.newContext({
      storageState: this._loadState()
    });

    return this.contextInstance;
  }

  async launchStrategy(navigator) {
    if (process.env.USE_SPECIFIC_PROFILE === 'true') {
      return await navigator.launchPersistentContext(process.env.PATH_SPECIFIC_PROFILE, {
        headless: false,
        slowMo: 50
      });
    }

    return await navigator.launch({
      headless: false
    });
  }

  async close() {
    if (!this.contextInstance) return;

    try {
      // Salvar estado atual (cookies + storages)
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
