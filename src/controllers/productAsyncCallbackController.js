const ScrapperProduct = require('../useCases/ScrapperProduct');
const WaitingFor = require('../tools/WaitingFor');

exports.productByUrlAsyncCallback = async (req, res) => {

    const { urlEncoded } = req.params;
   
    try {
      const doDelay = new WaitingFor();

      const { targetUrl, callbackUrl, externalId } = req.body;

      if (!targetUrl || !callbackUrl || !externalId) {
        return res.status(400).json({ error: 'Parâmetros obrigatórios: targetUrl, callbackUrl, externalId' });
      }

      res.status(200).json({ status: 'success', message: 'Processamento iniciado' });

      setImmediate(async () => {
          const maxRety = 4;

          for (let retryCount = 1; retryCount <= 4; retryCount++) {
            try {
              console.log(`[BG] Iniciando scraping para ${targetUrl}`);

              const getProductData = await new ScrapperProduct(targetUrl).handle();

              console.log(`[BG] Scraping concluído para ${externalId}`);

              await fetch(callbackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  external_id: externalId,
                  data: getProductData
                })
              });

              console.log(`[BG] Callback enviado para ${callbackUrl}`);

              return; 

            } catch (err) {
              console.error(`[BG] Erro no processamento (${externalId}) e pagina ${targetUrl} :`, err);
              if (retryCount === maxRety) {
                  console.error(`[BG] Todas as ${maxRety} tentativas falharam para ${externalId} e pagina ${targetUrl} . Lançando exceção.`);
                  
                  throw new Error(JSON.stringify({ 
                      error: 'Failed to process and callback after ' + maxRety + ' retries',
                      details: `Scraping for externalId: ${externalId} failed on target page ${targetUrl}`,
                      lastError: err.message || 'Unknown error'
                  }));
              }
              doDelay.rangeMicroseconds(510, 1502);
            }
          }
        });

      } catch (error) {
        console.error('Api error:', error);
        res.status(500).json(JSON.parse(error));
      }
  };