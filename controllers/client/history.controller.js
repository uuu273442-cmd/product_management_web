const Order = require('../../models/order.model');

const showCheckoutHelper = require('../../helper/showCheckout');

module.exports.index = async (req, res) => {
  let orders = [];
  
  if (res.locals.user) {
    orders = await Order.find({
      user_id: res.locals.user.id,
      deleted: false,
    });
  } else {
    orders = await Order.find({
      cart_id: req.cookies.cart_id,
      deleted: false,
    });
  }

  showCheckoutHelper.showCheckout(orders);

  res.render('client/pages/history/index', {
    titlePage: 'Lịch sử đơn hàng',
    orders: orders,
  });
};
