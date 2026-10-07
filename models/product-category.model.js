const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
  title: String,
  parent_id: {
    type: String,
    default: '',
  },
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  slug: {
    type: String,
    slug: 'title',
    unique: true,
  },
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date,
  },
  updatedBy: [
    {
      account_id: String,
      titleUpdated: String,
      updatedAt: Date,
    },
  ],
});

const ProductsCategory = mongoose.model(
  'ProductsCategory',
  productCategorySchema,
  'product-category'
);

module.exports = ProductsCategory;
