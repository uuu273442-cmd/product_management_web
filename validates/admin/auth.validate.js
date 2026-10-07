const Account = require('../../models/account.model');

const systemConfig = require('../../config/system');

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash('error', 'Phải nhập đầy đủ email!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  if (!req.body.password) {
    req.flash('error', 'Phải nhập đầy đủ mật khẩu!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  next();
};

module.exports.index = async (req, res, next) => {
  if (req.cookies.token) {
    const user = await Account.findOne({ token: req.cookies.token });
    if (!user) {
      req.flash(
        'error',
        'Vui lòng không được thay đổi bất kỳ thông tin của web!'
      );
      res.clearCookie('token');
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
      return;
    }
  }

  next();
};
