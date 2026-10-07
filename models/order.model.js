const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema(
  {
    cart_id: String,
    user_id: String,
    userInfo: {
      name: String,
      phone: String,
      address: String,
    },
    products: [
      {
        products_id: String,
        quantity: Number,
        price: Number,
        discountPercentage: Number,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', ordersSchema, 'orders');

module.exports = Order;
