const productsCategory = require('../../models/product-category.model');
const blogsCategory = require('../../models/blog-category.model');

const helperCreateTree = require('../../helper/create-tree');

module.exports.layoutProductsCategory = async (req, res, next) => {
  const find = {
    deleted: false,
    status: 'active',
  };
  const records = await productsCategory.find(find);
  const recordsBlogs = await blogsCategory.find(find);
  const categoryProducts = helperCreateTree.tree(records);
  const categoryBlogs = helperCreateTree.tree(recordsBlogs);

  res.locals.layoutCategoryProducts = categoryProducts;
  res.locals.layoutCategoryBlogs = categoryBlogs;
  next();
};
