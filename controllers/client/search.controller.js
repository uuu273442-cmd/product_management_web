const Product = require('../../models/product.model');

const newPriceHelper = require('../../helper/newPrice');

module.exports.index = async (req, res) => {
  keyword = req.query.keyword;
  let newProducts = [];

  if (keyword) {
    const regex = new RegExp(keyword, 'i');
    const records = await Product.find({
      title: regex,
      deleted: false,
      status: 'active',
    });

    newProducts = newPriceHelper.newPrice(records);
  }

  res.render('client/pages/search/index', {
    titlePage: 'Kết quả tìm kiếm',
    keyword: keyword,
    products: newProducts,
  });
};
