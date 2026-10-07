const BlogCategory = require('../models/blog-category.model');
const ProductCategory = require('../models/product-category.model');

module.exports.getSubCategory = async (parentId) => {
  const getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: 'active',
      deleted: false,
    });

    let getSubAll = [...subs];
    for (const sub of subs) {
      const childs = await getSubCategory(sub.id);
      getSubAll = getSubAll.concat(childs);
    }

    return getSubAll;
  };

  const result = await getSubCategory(parentId);
  return result;
};

module.exports.getSubCategoryBlogs = async (parentId) => {
  const getSubCategory = async (parentId) => {
    const subs = await BlogCategory.find({
      parent_id: parentId,
      status: 'active',
      deleted: false,
    });

    let getSubAll = [...subs];
    for (const sub of subs) {
      const childs = await getSubCategory(sub.id);
      getSubAll = getSubAll.concat(childs);
    }

    return getSubAll;
  };

  const result = await getSubCategory(parentId);
  return result;
};
