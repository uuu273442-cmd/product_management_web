const md5 = require('md5');
const Accounts = require('../../models/account.model');

const systemConfig = require('../../config/system');

// [GET] /admin/auth/login
module.exports.index = async (req, res) => {
  res.render('admin/pages/auth/login', {
    pageTitle: 'Trang đăng nhập',
  });
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const find = {
      email: email,
      deleted: false,
    };
    const user = await Accounts.findOne(find);
    if (!user) {
      req.flash('error', 'Không tìm thấy người dùng!');
      res.redirect(req.get('Referrer') || '/');
      return;
    }

    if (md5(password) != user.password) {
      req.flash('error', 'Mật khẩu không đúng!');
      res.redirect(req.get('Referrer') || '/');
      return;
    }

    if (user.status === 'inactive') {
      req.flash('error', 'Tài khoản đã bị khóa!');
      res.redirect(req.get('Referrer') || '/');
      return;
    }

    res.cookie('token', user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } catch (error) {
    req.flash('error', 'Đăng nhập thất bại!');
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
