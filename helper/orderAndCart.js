const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

module.exports.orderAndCart = async (user, res, req) => {
  const oldCartId = req.cookies.cart_id;

  if (oldCartId) {
    await Order.updateMany(
      {
        cart_id: oldCartId,
        user_id: { $exists: false },
        deleted: false,
      },
      {
        $set: { user_id: user.id },
      }
    );
  }

  const cart = await Cart.findOne({
    user_id: user.id,
  });

  if (cart) {
    res.cookie('cart_id', cart.id);
  } else {
    await Cart.updateOne({ _id: req.cookies.cart_id }, { user_id: user.id });
  }
};
