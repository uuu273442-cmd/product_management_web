const md5 = require('md5');
const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');

// [GET] /admin/replace-password
module.exports.index = (req, res) => {
  res.render('admin/pages/rePlacePassword/index', {
    titlePage: 'Đổi mật khẩu',
  });
};

// [PATCH] /admin/replace-password/edit
module.exports.editPatch = async (req, res) => {
  try {
    const token = req.cookies.token;
    req.body.password = md5(req.body.password);
    await Account.updateOne({ token: token }, { password: req.body.password });
    req.flash('success', 'cập nhật mật khẩu thành công!');
  } catch (error) {
    req.flash('error', 'cập nhật mật khẩu thất bại!');
  }
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
