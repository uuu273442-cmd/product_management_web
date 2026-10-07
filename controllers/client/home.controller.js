const Product = require('../../models/product.model');

const helperNewPrice = require('../../helper/newPrice');

// [GET] /
module.exports.index = async (req, res) => {
  const productsFeatured = await Product.find({
    featured: '1',
    deleted: false,
    status: 'active',
    stock: { $gte: 1 },
  }).limit(6);

  // sp sản phẩm nổi bật trang chủ
  const newProductsFeatured = helperNewPrice.newPrice(productsFeatured);

  // ds sản phẩm mới nhất trang chủ
  const newProducts = await Product.find({
    deleted: false,
    status: 'active',
    stock: { $gte: 1 },
  })
    .sort({ position: 'desc' })
    .limit(6);

  const newProductsNew = helperNewPrice.newPrice(newProducts);

  res.render('client/pages/home/index', {
    titlePage: 'Trang chủ',
    productsFeatured: newProductsFeatured,
    newProducts: newProductsNew,
  });
};
