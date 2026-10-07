const Product = require('../models/product.model');
const newPriceHelper = require('./newPrice');

module.exports.detail = async (carts) => {
  if (carts && carts.products.length > 0) {
    for (const cart of carts.products) {
      const product = await Product.findOne({ _id: cart.products_id }).select(
        'thumbnail title price slug discountPercentage stock'
      );
      newPriceHelper.priceNewProduct(product);
      product.newPrice = +product.newPrice;
      cart.productInfo = product;
      cart.totalPrice = cart.productInfo.newPrice * cart.quantity;
    }
  }

  if (carts) {
    carts.totalPrice = carts.products.reduce((total, cart) => {
      return total + cart.totalPrice;
    }, 0);
  }

  return carts;
};
