const Order = require('../../models/order.model');
const Product = require('../../models/product.model');

const showCheckoutHelper = require('../../helper/showCheckout');
const helperNewProducts = require('../../helper/newPrice');

// [GET] /admin/checkout
module.exports.index = async (req, res) => {
  const { status, keyword } = req.query;
  let key = '';
  const filter = {
    deleted: false,
  };

  if (status) filter.status = status;
  if (keyword) {
    key = keyword;
    const regex = new RegExp(keyword, 'i');
    filter.$or = [
      { 'userInfo.name': regex },
      { 'userInfo.phone': regex },
      { 'userInfo.address': regex },
    ];
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 });
  showCheckoutHelper.showCheckout(orders);

  res.render('admin/pages/checkout/index', {
    titlePage: 'Quản lý đơn hàng',
    orders: orders,
    filterStatus: status,
    keyword: key,
  });
};

// [GET] /admin/checkout/:id
module.exports.detail = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id });
  if (order.products.length > 0) {
    for (const product of order.products) {
      helperNewProducts.priceNewProduct(product);
      product.newPrice = +product.newPrice;
      product.totalPrice = product.newPrice * product.quantity;
    }
  }
  order.totalPrice = order.products.reduce((sum, item) => {
    return sum + item.totalPrice;
  }, 0);
  res.render('admin/pages/checkout/detail', {
    titlePage: 'Chi tiết đơn hàng',
    order: order,
  });
};

// [PATCH] /admin/checkout/:id/status
module.exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (status === 'cancelled') {
      const order = await Order.findOne({ _id: id });
      for (const product of order.products) {
        await Product.updateOne({ _id: product.products_id }, { $inc: { stock: +product.quantity } });
      }
    }
    await Order.updateOne({ _id: id }, { status: status });
    req.flash('success', 'Cập nhật trạng thái đơn hàng thành công!');
  } catch (error) {
    req.flash('error', 'Cập nhật trạng thái đơn hàng thất bại!');
  }
  res.redirect(`/admin/checkout`);
};
