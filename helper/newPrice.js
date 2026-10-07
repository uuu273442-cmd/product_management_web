module.exports.newPrice = (products) => {
  const newProduct = products.map((item) => {
    item.newPrice = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(2);
    return item;
  });

  return newProduct;
};

module.exports.priceNewProduct = (product) => {
  product.newPrice = (
    (product.price * (100 - product.discountPercentage)) /
    100
  ).toFixed(2);
};
