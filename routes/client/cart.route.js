const express = require('express');
const route = express.Router();

const controller = require('../../controllers/client/cart.controller');
const quantityValidate = require('../../validates/client/quantity.validate');

route.get('/', controller.index);

route.post(
  '/add/:product_id',
  quantityValidate.quantityPost,
  controller.addPost
);

route.get('/delete/:id', controller.delete);

route.get(
  '/update/:product_id/:quantity',
  quantityValidate.quantity,
  controller.update
);

module.exports = route;
