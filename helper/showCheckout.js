const helperNewProducts = require('./newPrice');

module.exports.showCheckout = (orders) => {
  if (orders.length > 0) {
    for (const order of orders) {
      for (const product of order.products) {
        helperNewProducts.priceNewProduct(product);
        product.newPrice = +product.newPrice;
        product.totalPrice = product.newPrice * product.quantity;
      }
      order.totalPrice = order.products.reduce((sum, item) => {
        return sum + item.totalPrice;
      }, 0);
    }
  }
}