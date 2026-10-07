const BlogCategory = require('../../models/blog-category.model');
const Account = require('../../models/account.model');

const helperSearch = require('../../helper/search');
const helperCreateTree = require('../../helper/create-tree');
const systemConfig = require('../../config/system');
const filterStatusHelper = require('../../helper/filterStatus');
const showBlogHelper = require('../../helper/showBlogCreateAndEdit');
const showBlogDetailHelper = require('../../helper/showBlogDateDetail');  

// [GET] admin/blogs-category
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  // filter-status
  const filterStatus = filterStatusHelper(req.query, find);

  // search
  const objectSearch = helperSearch(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const record = await BlogCategory.find(find);

  // show blog data
  await showBlogHelper.showDataIndex(record);

  const newRecord = helperCreateTree.tree(record);

  res.render('admin/pages/blogs-category/index', {
    titlePage: 'Danh mục bài viết',
    records: newRecord,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};

// [GET] admin/blogs-category/trash
module.exports.trash = async (req, res) => {
  const find = {
    deleted: true,
  };

  // filter-status
  const filterStatus = filterStatusHelper(req.query, find);

  // search
  const objectSearch = helperSearch(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const record = await BlogCategory.find(find);

  for (let item of record) {
    const user = await Account.findOne({
      _id: item.deletedBy.account_id,
    });
    if (user) {
      item.accountFullName = user.fullName;
    }
  }

  res.render('admin/pages/blogs-category/trash', {
    titlePage: 'Trang bài viết rác',
    records: record,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};

// [GET] admin/blogs-category/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };
  const record = await BlogCategory.find(find);
  const newRecord = helperCreateTree.tree(record);

  res.render('admin/pages/blogs-category/create', {
    titlePage: 'Tạo bản ghi danh mục bài viết',
    records: newRecord,
  });
};

// [POST] admin/blogs-category/create
module.exports.createPost = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs-category_create')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  try {
    const body = req.body;

    const objectBody = {
      title: body.title,
      parent_id: body.parent_id,
      description: body.description,
      thumbnail: body.thumbnail,
      status: body.status,
      position: body.position,
    };

    if (objectBody.position === '') {
      const countProduct = await BlogCategory.countDocuments();
      const count = countProduct + 1;
      objectBody.position = count;
    } else {
      objectBody.position = +objectBody.position;
    }

    objectBody.createdBy = {
      account_id: res.locals.user.id,
    };

    const record = new BlogCategory(objectBody);
    await record.save();
    req.flash('success', 'tạo danh mục thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/blogs-category`);
  } catch (error) {
    req.flash('success', 'tạo danh mục thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/blogs-category/create`);
  }
};

// [DELETE] admin/blogs-category/deleted/:id
module.exports.deleted = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs-category_delete')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  const id = req.params.id;
  await BlogCategory.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash('success', 'xóa danh mục thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [GET] admin/blogs-category/trash/change-status/:status/:id
// [GET] admin/blogs-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs-category_edit')) {
    res.redirect(req.get('Referrer') || '/');
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
  await BlogCategory.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );
  req.flash('success', 'Cập nhật trạng thái thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [PATCH] admin/blogs-category/change-multi
// [PATCH] admin/blogs-category/trash/change-multi
module.exports.changeMulti = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs-category_edit')) {
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
      await BlogCategory.updateMany(
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
      await BlogCategory.updateMany(
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
    case 'recovery-all':
      updatedBy.titleUpdated = 'khôi phục danh mục bài viết';
      await BlogCategory.updateMany(
        { _id: { $in: ids } },
        {
          deleted: false,
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash('success', `Khôi phục ${ids.length} bản ghi thành công!`);
      break;
    case 'delete-all':
      await BlogCategory.updateMany(
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
    case 'permanentlyDelete-all':
      await BlogCategory.deleteMany({ _id: { $in: ids } });
      req.flash('success', `Xóa vĩnh viễn ${ids.length} bản ghi thành công!`);
      break;
    case 'change-position':
      updatedBy.titleUpdated = 'thay đổi vị trí danh mục bài viết';
      for (const item of ids) {
        let [id, position] = item.split('-');
        await BlogCategory.updateOne(
          { _id: id },
          {
            position: +position,
            $push: { updatedBy: updatedBy },
          }
        );
      }
      req.flash('success', `Cập nhật vị trí ${ids.length} bản ghi thành công!`);
      break;
    default:
      break;
  }
  res.redirect(req.get('Referrer') || '/');
};

// [PATCH] admin/blogs-category/trash/recovery/:id
module.exports.recovery = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs-category_edit')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  const id = req.params.id;
  const updatedBy = {
    titleUpdated: 'khôi phục danh mục bài viết',
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  await BlogCategory.updateOne(
    { _id: id },
    {
      deleted: false,
      $push: { updatedBy: updatedBy },
    }
  );
  req.flash('success', 'Khôi phục danh mục thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [DELETE] admin/blogs-category/trash/permanent-delete/:id
module.exports.permanentDelete = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs-category_delete')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  const id = req.params.id;
  await BlogCategory.deleteOne({ _id: id });
  req.flash('success', 'xóa vĩnh viễn danh mục thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [GET] admin/blogs-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await BlogCategory.findOne({
      _id: id,
      deleted: false,
    });

    if (record.parent_id === '') {
      record.category = '';
    } else {
      const category = await BlogCategory.findOne({
        _id: record.parent_id,
        deleted: false,
      });
      record.category = category.title;
    }

    // show create detail
    await showBlogDetailHelper.showDetailCreate(record);

    // show edit detail
    await showBlogDetailHelper.showDetailEdit(record);

    res.render('admin/pages/blogs-category/detail', {
      titlePage: 'Chi tiết danh mục',
      record: record,
    });
  } catch (error) {
    req.flash('error', 'Lỗi ID!');
    res.redirect(`${systemConfig.prefixAdmin}/blogs-category`);
  }
};

// [GET] admin/blogs-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const records = await BlogCategory.find({ deleted: false });
    const recordTree = helperCreateTree.tree(records);
    const record = await BlogCategory.findOne(find);

    res.render('admin/pages/blogs-category/edit', {
      titlePage: 'Sửa danh mục',
      recordTree: recordTree,
      records: record,
    });
  } catch (error) {
    req.flash('error', 'Danh mục không tồn tại!');
    res.redirect(`${systemConfig.prefixAdmin}/blogs-category`);
  }
};

// [PATCH] admin/blogs-category/edit/:id
module.exports.editPatch = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs-category_edit')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  const body = req.body;

  const objectBody = {
    title: body.title,
    parent_id: body.parent_id,
    description: body.description,
    thumbnail: body.thumbnail,
    status: body.status,
    position: body.position,
  };

  objectBody.position = body.position === '' ? 0 : +objectBody.position;

  const updatedBy = {
    titleUpdated: 'cập nhật danh mục bài viết',
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  try {
    await BlogCategory.updateOne(
      { _id: req.params.id },
      {
        ...objectBody,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash('success', 'Sửa danh mục thành công!');
  } catch (error) {
    req.flash('error', 'Danh mục không tồn tại!');
  }
  res.redirect(`${systemConfig.prefixAdmin}/blogs-category`);
};
