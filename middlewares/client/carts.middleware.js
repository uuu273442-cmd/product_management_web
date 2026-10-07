const Cart = require('../../models/cart.model');

module.exports.cartId = async (req, res, next) => {
  const cart = await Cart.findOne({
    _id: req.cookies.cart_id,
  });
  try {
    if (!cart) {
      const newCart = new Cart();
      await newCart.save();

      // set time expiresAt cart
      const expiresAt = 1000 * 60 * 60 * 24 * 30;
      res.cookie('cart_id', newCart.id, {
        expires: new Date(Date.now() + expiresAt),
      });
    }
    if (cart.products.length > 0) {
      res.locals.totalQuality = cart.products.reduce(
        (total, item) => total + item.quantity,
        0
      );
    }
  } catch (err) {
    console.log('error create new cart ' + err.message);
  }

  next();
};
