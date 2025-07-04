const express = require('express');

const app = express();

const productRoutes = require('./src/routers/productRouter');

app.use(express.json());

app.use('/api/products', productRoutes);

app.get('/api', (req, res) => {
    res.send('Mercado livre scrapper!');
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
