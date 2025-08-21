const path = require('path');
const fs = require('fs');

module.exports = class NavigatorFactory {
  
  async launchAndContexthStrategy(navigatorInst) {
    const launched = await this.launchStrategy(navigatorInst);
    const statePath = path.resolve('ml_state.json');

    if (process.env.USE_SPECIFIC_PROFILE === 'true') {
      const originalClose = launched.close.bind(launched);
      launched.close = async () => {
        try {
          await launched.storageState({ path: statePath });
        } catch (e) {
          console.error('Erro ao salvar storageState (persistente):', e);
        }
        return originalClose();
      };
      return launched;
    }

    let context;
    if (fs.existsSync(statePath)) {
      context = await launched.newContext({
        storageState: statePath
      });
    } else {
      context = await launched.newContext();
    }

    const originalClose = context.close.bind(context);
    context.close = async () => {
      try {
        await context.storageState({ path: statePath });
      } catch (e) {
        console.error('Erro ao salvar storageState:', e);
      }
      return originalClose();
    };

    return context;
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
};
