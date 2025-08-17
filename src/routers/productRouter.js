const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const productAsyncCallbackController = require('../controllers/productAsyncCallbackController');

router.get('/by-url-encoded/:urlEncoded', productController.getProductByUrl);
router.post('/scrapping-async', productAsyncCallbackController.productByUrlAsyncCallback);

module.exports = router;