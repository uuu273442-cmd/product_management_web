const User = require('../../models/user.model');

const filterStatusHelper = require('../../helper/filterStatus');
const searchHelper = require('../../helper/search');

// [GET] /admin/users
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

  const records = await User.find(find).select('-password -token_user');

  res.render('admin/pages/user/index', {
    titlePage: 'Trang danh sách người dùng',
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};

// [GET] /admin/users/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false,
    };
    const records = await User.findOne(find).select('-password -token_user');
    res.render('admin/pages/user/detail', {
      titlePage: 'Trang chi tiết người dùng',
      records: records,
    });
  } catch (error) {
    req.flash('error', 'Lỗi Id');
    res.redirect(req.get('Referrer') || '/');
  }
};

// [PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  if (!res.locals.role.permissions.includes('users_edit')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }
  const objectParams = {
    status: req.params.status,
    id: req.params.id,
  };

  const { status, id } = objectParams;
  await User.updateOne(
    { _id: id },
    {
      status: status,      
    }
  );
  req.flash('success', 'Cập nhật trang thái thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [DELETE] /admin/users/delete/:id
module.exports.delete = async (req, res) => {
  if (!res.locals.role.permissions.includes('users_delete')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }
  await User.updateOne(
    { _id: req.params.id },
    {
      deleted: true,
    }
  );
  req.flash('success', 'Xóa người dùng thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [PATCH] /admin/users/change-multi
module.exports.changeMulti = async (req, res) => {
  if (!res.locals.role.permissions.includes('users_edit')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  const objectBody = {
    ids: req.body.ids.split(', '), 
    type: req.body.type,
  };

  const { ids, type } = objectBody;
  switch (type) {
    case 'active':
      await User.updateMany(
        { _id: { $in: ids } },
        {
          status: type, 
        }
      );
      req.flash(
        'success',
        `Cập nhật ${ids.length} bản ghi hoạt động thành công!`
      );
      break;
    case 'inactive':
      await User.updateMany(
        { _id: { $in: ids } },
        {
          status: type,
        }
      );
      req.flash(
        'success',
        `Cập nhật ${ids.length} bản ghi không hoạt động thành công!`
      );
      break;
    case 'delete-all':
      await User.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
        }
      );
      req.flash('success', `Xóa ${ids.length} bản ghi thành công!`);
      break;
    default:
      break;
  }
  res.redirect(req.get('Referrer') || '/');
};
