const express = require('express');

const controllerProduct = require('../../controllers/client/product.controller');

const route = express.Router();

route.get('/', controllerProduct.index);

route.get('/detail/:slug', controllerProduct.detail);

route.get('/:slug_category', controllerProduct.slugCategory);

module.exports = route;
