const mongoose = require('mongoose');

const cartsSchema = new mongoose.Schema(
  {
    user_id: String,
    products: [
      {
        products_id: String,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartsSchema, 'carts');

Cart.collection.createIndex(
  { updatedAt: 1 },
  { expireAfterSeconds: 60 * 24 * 60 * 30 }
);

module.exports = Cart;
