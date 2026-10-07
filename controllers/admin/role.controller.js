const Role = require('../../models/role.model');

const showBlogHelper = require('../../helper/showBlogCreateAndEdit');
const systemConfig = require('../../config/system');

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const records = await Role.find(find);
  await showBlogHelper.showDataIndex(records);

  res.render('admin/pages/roles/index', {
    titlePage: 'Phân quyền',
    records: records,
  });
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render('admin/pages/roles/create', {
    titlePage: 'Tạo mới quyền',
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  if (!res.locals.role.permissions.includes('roles_edit')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }
  const objectBody = {
    title: req.body.title,
    description: req.body.description,
  };
  objectBody.createdBy = {
    account_id: res.locals.user.id,
  };
  const record = new Role(objectBody);
  await record.save();

  req.flash('success', 'tạo quyền thành công!');
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const myName = [];
    const find = {
      _id: req.params.id,
      deleted: false,
    };
    const record = await Role.findOne(find);

    if (record.permissions.length > 0) {
      record.permissions.forEach((permission) => {
        const [name] = permission.split('_');
        if (!myName.includes(name)) {
          myName.push(name);
        }
      });
    }

    res.render('admin/pages/roles/detail', {
      titlePage: 'Chi tiết quyền',
      record: record,
      arrayModuleName: myName,
    });
  } catch (error) {
    req.flash('error', 'ID tồn tại!');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false,
    };
    const record = await Role.findOne(find);

    res.render('admin/pages/roles/edit', {
      titlePage: 'Sửa quyền',
      record: record,
    });
  } catch (error) {
    req.flash('error', 'ID tồn tại!');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  if (!res.locals.role.permissions.includes('roles_edit')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await Role.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash('success', 'Sửa thành công!');
  } catch (error) {
    req.flash('error', 'Lỗi!');
  }
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [DELETE] /admin/roles/deleted/:id
module.exports.delete = async (req, res) => {
  if (!res.locals.role.permissions.includes('roles_delete')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }
  const id = req.params.id;
  const deletedBy = {
    account_id: res.locals.user.id,
    deletedAt: new Date(),
  };
  await Role.updateOne(
    { _id: id },
    {
      deleted: true,
      $push: { deletedBy: deletedBy },
    }
  );
  req.flash('success', 'Xóa thành công!');
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/permission
module.exports.permission = async (req, res) => {
  const find = {
    deleted: false,
  };

  const records = await Role.find(find);
  res.render('admin/pages/roles/permission', {
    titlePage: 'Phân quyền',
    records: records,
  });
};

// [PATCH] admin/roles/permission
module.exports.permissionPatch = async (req, res) => {
  if (!res.locals.role.permissions.includes('roles_permissions')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }
  try {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash('success', 'Cập nhật thành công!');
  } catch (error) {
    req.flash('error', 'Lỗi!');
  }
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [PATCH] /admin/roles/change-multi
module.exports.changeMulti = async (req, res) => {
  if (!res.locals.role.permissions.includes('roles_delete')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }
  try {
    const ids = req.body.ids.split(', ');
    const deletedBy = {
      account_id: res.locals.user.id,
      deletedAt: new Date(),
    };
    await Role.updateMany(
      { _id: { $in: ids } },
      {
        deleted: true,
        deletedBy: deletedBy,
      }
    );
    req.flash('success', `Xóa ${ids.length} nhóm quyền thành công!`);
  } catch (error) {
    req.flash('error', 'Lỗi');
  }
  res.redirect(req.get('Referrer') || '/');
};
