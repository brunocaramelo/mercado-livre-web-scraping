const ScrapperProduct = require('../useCases/ScrapperProduct');

exports.productByUrlAsyncCallback = async (req, res) => {

    const { urlEncoded } = req.params;
   
    try {
  
      const { targetUrl, callbackUrl, externalId } = req.body;

      if (!targetUrl || !callbackUrl || !externalId) {
        return res.status(400).json({ error: 'Parâmetros obrigatórios: targetUrl, callbackUrl, externalId' });
      }

      res.status(200).json({ status: 'success', message: 'Processamento iniciado' });

      setImmediate(async () => {
          try {
            console.log(`[BG] Iniciando scraping para ${targetUrl}`);

            // const targetUrlProduct = Buffer.from(targetUrl, 'utf-8').toString('base64');
            const targetUrlProduct = targetUrl;

            const getProductData = await new ScrapperProduct(targetUrlProduct).handle();

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
          } catch (err) {
            console.error(`[BG] Erro no processamento (${externalId}):`, err);
          }
        });

      } catch (error) {
        console.error('Api error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  };