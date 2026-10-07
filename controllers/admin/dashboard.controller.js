const models = [
  { key: 'categoryProduct', model: require('../../models/product-category.model') },
  { key: 'product', model: require('../../models/product.model') },
  { key: 'account', model: require('../../models/account.model') },
  { key: 'user', model: require('../../models/user.model') }
];

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  let statistic = {}, error = null;
  try {
    for (const { key, model } of models) {
      const [total, active, inactive] = await Promise.all([
        model.countDocuments({ deleted: false }),
        model.countDocuments({ status: 'active', deleted: false }),
        model.countDocuments({ status: 'inactive', deleted: false })
      ]);
      statistic[key] = { total, active, inactive };
    }
  } catch (error) {
    error = error.message;
    statistic = {
      categoryProduct: { total: 0, active: 0, inactive: 0 },
      product: { total: 0, active: 0, inactive: 0 },
      account: { total: 0, active: 0, inactive: 0 },
      user: { total: 0, active: 0, inactive: 0 },
    };
  }

  res.render('admin/pages/dashboard/index', {
    titlePage: 'Trang tổng quan',
    statistic,
    error,
  });
};
