const md5 = require('md5');

const Account = require('../../models/account.model');
const Role = require('../../models/role.model');

const systemConfig = require('../../config/system');
const showBlogHelper = require('../../helper/showBlogCreateAndEdit');
const filterStatusHelper = require('../../helper/filterStatus');
const searchHelper = require('../../helper/search');

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const filterStatus = filterStatusHelper(req.query, find);
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    const regex = objectSearch.regex;
    find.$or = [
      { fullName: regex },
      { email: regex },
      { phone: regex },
    ];
  }

  const records = await Account.find(find).select('-password -token');
  for (let item of records) {
    const titleRole = await Role.findOne({ _id: item.role_id });
    if (titleRole) {
      item.titleRole = titleRole.title;
    }
  }

  await showBlogHelper.showDataIndex(records);

  res.render('admin/pages/accounts/index', {
    titlePage: 'Trang danh sách tài khoản',
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const records = await Role.find({ deleted: false });
  res.render('admin/pages/accounts/create', {
    titlePage: 'Thêm mới tài khoản',
    records: records,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  if (!res.locals.role.permissions.includes('accounts_create')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }
  try {
    const find = {
      email: req.body.email,
      deleted: false,
    };
    const emailExits = await Account.findOne(find);
    if (emailExits) {
      req.flash('error', 'Email đã tồn tại, vui lòng nhập email khác!');
      res.redirect(req.get('Referrer') || '/');
      return;
    } else {
      req.body.createdBy = {
        account_id: res.locals.user.id,
      };
      req.body.password = md5(req.body.password);
      const record = new Account(req.body);
      await record.save();
      req.flash('success', 'Tạo tài khoản thành công!');
    }
  } catch (error) {
    req.flash('error', 'Tạo tài khoản thất bại!');
  }
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
};

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false,
    };
    const data = await Role.find({ deleted: false });
    const records = await Account.findOne(find).select('-password -token');
    res.render('admin/pages/accounts/detail', {
      titlePage: 'Trang chi tiết tại khoản',
      records: records,
      data: data,
    });
  } catch (error) {
    req.flash('error', 'Lỗi Id');
    res.redirect(req.get('Referrer') || '/');
  }
};

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  if (!res.locals.role.permissions.includes('accounts_edit')) {
    res.redirect(req.get('Referrer') || '/');
    console.log(req.params);
    return;
  }
  const objectParams = {
    status: req.params.status,
    id: req.params.id,
  };

  const { status, id } = objectParams;
  const updatedBy = {
    titleUpdated: 'chính sửa trạng thái',
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  await Account.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );
  req.flash('success', 'Cập nhật trang thái thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
  if (!res.locals.role.permissions.includes('accounts_delete')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }
  const deletedBy = {
    account_id: res.locals.user.id,
    deletedAt: new Date(),
  };
  await Account.updateOne(
    { _id: req.params.id },
    {
      deleted: true,
      $push: { deletedBy: deletedBy },
    }
  );
  req.flash('success', 'Xóa tài khoản thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false,
    };
    const data = await Role.find({ deleted: false });
    const records = await Account.findOne(find);
    res.render('admin/pages/accounts/edit', {
      titlePage: 'Thêm mới tài khoản',
      data: data,
      records: records,
    });
  } catch (error) {
    req.flash('error', 'Lỗi Id');
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  if (!res.locals.role.permissions.includes('accounts_edit')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }
  try {
    const id = req.params.id;
    const find = {
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    };
    const emailExits = await Account.findOne(find);
    if (emailExits) {
      req.flash('error', 'Email đã tồn tại!');
      res.redirect(req.get('Referrer') || '/');
      return;
    }
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    const updatedBy = {
      account_id: res.locals.user.id,
      titleUpdated: 'Cập nhật tài khoản',
      updatedAt: new Date(),
    };

    await Account.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash('success', 'Chỉnh sửa tài khoản thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    req.flash('error', 'Chỉnh sửa tài khoản thất bại!');
    res.redirect(req.get('Referrer') || '/');
  }
};

// [PATCH] /admin/accounts/change-multi
module.exports.changeMulti = async (req, res) => {
  if (!res.locals.role.permissions.includes('accounts_edit')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  const objectBody = {
    ids: req.body.ids.split(', '),
    type: req.body.type,
  };

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  const { ids, type } = objectBody;
  switch (type) {
    case 'active':
      updatedBy.titleUpdated = 'chỉnh sửa trang thái';
      await Account.updateMany(
        { _id: { $in: ids } },
        {
          status: type,
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash(
        'success',
        `Cập nhật ${ids.length} bản ghi hoạt động thành công!`
      );
      break;
    case 'inactive':
      updatedBy.titleUpdated = 'chỉnh sửa trang thái';
      await Account.updateMany(
        { _id: { $in: ids } },
        {
          status: type,
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash(
        'success',
        `Cập nhật ${ids.length} bản ghi không hoạt động thành công!`
      );
      break;
    case 'delete-all':
      await Account.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash('success', `Xóa ${ids.length} bản ghi thành công!`);
      break;
    default:
      break;
  }
  res.redirect(req.get('Referrer') || '/');
};
