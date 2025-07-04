const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/by-url-encoded/:urlEncoded', productController.getProductByUrl);

module.exports = router;