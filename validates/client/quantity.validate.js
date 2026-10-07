const Product = require('../../models/product.model');

module.exports.quantity = async (req, res, next) => {
  const productId = req.params.product_id;
  const quantity = req.params.quantity;
  const product = await Product.findOne({ _id: productId });
  if (product.stock < quantity || quantity < 1) {
    req.flash('error', 'số lượng sản phẩm không hợp lệ!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  next();
};

module.exports.quantityPost = async (req, res, next) => {
  const productId = req.params.product_id;
  const quantity = +req.body.quantity;
  const product = await Product.findOne({ _id: productId });
  if (product.stock < quantity || quantity < 1) {
    req.flash('error', 'số lượng sản phẩm không hợp lệ!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  next();
};