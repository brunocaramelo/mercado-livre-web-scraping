const ScrapperProduct = require('../useCases/ScrapperProduct');

exports.getProductByUrl = async (req, res) => {

    const { urlEncoded } = req.params;
   
    try {
  
     const buffer = Buffer.from(urlEncoded, 'base64').toString('utf-8');

      const getProductData = await new ScrapperProduct(buffer.toString('base64')).handle();
     
      res.status(200).json(getProductData);

    } catch (error) {
      console.error('Api error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };