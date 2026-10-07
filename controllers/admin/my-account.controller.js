const Account = require('../../models/account.model');

const systemConfig = require('../../config/system');

// [GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render('admin/pages/myAccount/index', {
    titlePage: 'Thông tin cá nhân',
  });
};

// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render('admin/pages/myAccount/edit', {
    titlePage: 'Chỉnh sửa thông tin cá nhân',
  });
};

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  try {
    const id = res.locals.user.id;
    const emailExit = await Account.findOne({
      id: { $ne: id },
      email: req.body.email,
      deleted: false,
    });

    if (emailExit) {
      req.flash('error', 'Email đã tồn tại!');
      res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);
      return;
    } else {
      await Account.updateOne({ _id: id }, req.body);
      req.flash('success', 'chỉnh sửa thông tin thành công!');
    }
  } catch (error) {
    req.flash('error', 'chỉnh sửa thất bại!');
  }
  res.redirect(`${systemConfig.prefixAdmin}/my-account`);
};
