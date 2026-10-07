const md5 = require('md5');
const Account = require('../../models/account.model');

const checkPassHelper = require('../../helper/checkPassword');

module.exports.createPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash('error', 'Phải nhập đầy đủ họ tên!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

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

  if (!checkPassHelper.isValidPassword(req.body.password)) {
    req.flash('error', 'mật khẩu định dạng không đúng quy đinh!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  next();
};

module.exports.editPatch = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash('error', 'Phải nhập đầy đủ họ tên!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  if (!req.body.email) {
    req.flash('error', 'Phải nhập đầy đủ email!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  if (req.body.password) {
    if (!checkPassHelper.isValidPassword(req.body.password)) {
      req.flash('error', 'mật khẩu định dạng không đúng quy đinh!');
      res.redirect(req.get('Referrer') || '/');
      return;
    }
  }

  next();
};

module.exports.editPatchPassword = async (req, res, next) => {
  const user = await Account.findOne({ token: req.cookies.token });
  if (md5(req.body.password) === user.password) {
    req.flash('error', 'mật khẩu đã cũ, hãy nhập mật khẩu mới!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  if (req.body.password_check !== req.body.password) {
    req.flash('error', 'mật khẩu không trùng với mật khẩu xác thực!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  if (!checkPassHelper.isValidPassword(req.body.password)) {
    req.flash('error', 'mật khẩu định dạng không đúng quy đinh!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  next();
};
