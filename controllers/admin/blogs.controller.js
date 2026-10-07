const Blog = require('../../models/blog.model');
const BlogCategory = require('../../models/blog-category.model');
const Account = require('../../models/account.model');

const filterStatusHelper = require('../../helper/filterStatus');
const searchHelper = require('../../helper/search');
const paginationHelper = require('../../helper/pagination');
const filterSort = require('../../helper/filterSort');
const createTreeHelper = require('../../helper/create-tree');
const showBlogHelper = require('../../helper/showBlogCreateAndEdit');
const showBlogDetailHelper = require('../../helper/showBlogDateDetail');

const systemConfig = require('../../config/system');

// [GET] /admin/blogs
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const filterStatus = filterStatusHelper(req.query, find);

  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const countBlog = await Blog.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      limitItem: req.query.limit || 8,
      currentPage: 1,
    },
    req.query,
    countBlog
  );

  const views = filterSort(req.query);

  const blogs = await Blog.find(find)
    .sort(views)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  // slice description and content
  for (const blog of blogs) {
    blog.description = blog.description.slice(0, 100) + '...';
    blog.content = blog.content.slice(0, 100) + '...';
  }

  // show blog data
  await showBlogHelper.showDataIndex(blogs);

  res.render('admin/pages/blogs/index', {
    titlePage: 'Trang quản lý bài viết',
    blogs: blogs,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [DELETE] /admin/blogs/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  if (res.locals.role.permissions.includes('blogs_delete')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  const objectParams = {
    id: req.params.id,
  };

  const { id } = objectParams;

  await Blog.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );

  req.flash('success', 'Xóa bài viết thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [GET] /admin/blogs/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };

  const record = await BlogCategory.find(find);
  const category = createTreeHelper.tree(record);

  res.render('admin/pages/blogs/create', {
    pageTitle: 'Trang thêm mới bài viết',
    category: category,
  });
};

// [POST] /admin/blogs/create
module.exports.createPost = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs_create')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  const body = req.body;

  const objectBody = {
    title: body.title,
    blog_category_id: body.blog_category_id,
    content: body.content,
    description: body.description,
    thumbnail: body.thumbnail,
    status: body.status,
    position: body.position,
  };

  if (objectBody.position === '') {
    const countBlog = await Blog.countDocuments();
    const count = countBlog + 1;
    objectBody.position = count;
  } else {
    objectBody.position = +objectBody.position;
  }

  objectBody.createdBy = {
    account_id: res.locals.user.id,
  };

  const blogs = new Blog(objectBody);
  await blogs.save();

  req.flash('success', 'Tạo bài viết thành công!');
  res.redirect(`${systemConfig.prefixAdmin}/blogs`);
};

// [GET] /admin/blogs/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      _id: req.params.id,
      deleted: false,
    };

    const blogCategory = await BlogCategory.find({ deleted: false });
    const category = createTreeHelper.tree(blogCategory);
    const blog = await Blog.findOne(find);

    res.render('admin/pages/blogs/edit', {
      pageTitle: 'Trang chỉnh sửa bài viết',
      blog: blog,
      category: category,
    });
  } catch (error) {
    req.flash('error', 'Lỗi id!');
    res.redirect(`${systemConfig.prefixAdmin}/blogs`);
  }
};

// [PATCH] /admin/blogs/edit/:id
module.exports.editPatch = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs_edit')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  const body = req.body;

  const objectBody = {
    title: body.title,
    blog_category_id: body.blog_category_id,
    content: body.content,
    description: body.description,
    thumbnail: body.thumbnail,
    status: body.status,
    position: body.position,
  };

  objectBody.position = body.position === '' ? 0 : +objectBody.position;

  const updatedBy = {
    titleUpdated: 'cập nhật bài viết',
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  try {
    await Blog.updateOne(
      { _id: req.params.id },
      {
        ...objectBody,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash('success', 'cập nhật bài viết thành công!');
  } catch (error) {
    req.flash('error', 'cập nhật bài viết thất bại!');
  }

  res.redirect(`${systemConfig.prefixAdmin}/blogs`);
};

// [GET] /admin/blogs/trash
module.exports.trash = async (req, res) => {
  let find = {
    deleted: true,
  };

  const filterStatus = filterStatusHelper(req.query, find);

  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const countBlog = await Blog.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      limitItem: req.query.limit || 8,
      currentPage: 1,
    },
    req.query,
    countBlog
  );

  const blogs = await Blog.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  for (let blog of blogs) {
    const user = await Account.findOne({
      _id: blog.deletedBy.account_id,
    });
    if (user) {
      blog.accountFullName = user.fullName;
    }
  }

  // slice description and content
  for (const blog of blogs) {
    blog.description = blog.description.slice(0, 100) + '...';
    blog.content = blog.content.slice(0, 100) + '...';
  }

  res.render('admin/pages/blogs/trash', {
    pageTitle: 'Thùng rác bài viết',
    blogs: blogs,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/blogs/trash/recovery/:id
module.exports.recovery = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs_edit')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  const objectParams = {
    id: req.params.id,
  };

  const { id } = objectParams;
  const updatedBy = {
    titleUpdated: 'khôi phục bài viết',
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await Blog.updateOne(
    { _id: id },
    {
      deleted: false,
      $push: { updatedBy: updatedBy },
    }
  );

  req.flash('success', 'Khôi phục bài viết thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [DELETE] /admin/blogs/trash/permanentlyDelete/:id
module.exports.permanentlyDelete = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs_delete')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  const objectParams = {
    id: req.params.id,
  };

  const { id } = objectParams;

  await Blog.deleteOne({ _id: id });

  req.flash('success', 'Xóa vĩnh viễn bài viết thành công!');

  res.redirect(req.get('Referrer') || '/');
};

// [PATCH] /admin/blogs/trash/change-status/:status/:id
// [PATCH] /admin/blogs/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs_edit')) {
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

  await Blog.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );

  req.flash('success', 'Cập nhật trạng thái bài viết thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [PATCH] /admin/blogs/trash/change-multi
// [PATCH] /admin/blogs/change-multi
module.exports.changeMulti = async (req, res) => {
  if (!res.locals.role.permissions.includes('blogs_edit')) {
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  const objectBody = {
    id: req.body.ids.split(', '),
    status: req.body.type,
  };

  const { id, status } = objectBody;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  switch (status) {
    case 'active':
      updatedBy.titleUpdated = 'chỉnh sửa trang thái';
      await Blog.updateMany(
        { _id: { $in: id } },
        {
          status: 'active',
          $push: { updatedBy: updatedBy },
        }
      );

      req.flash(
        'success',
        `Cập nhật trang thái ${id.length} bài viết thành công!`
      );

      break;
    case 'inactive':
      updatedBy.titleUpdated = 'chỉnh sửa trang thái';
      await Blog.updateMany(
        { _id: { $in: id } },
        {
          status: 'inactive',
          $push: { updatedBy: updatedBy },
        }
      );

      req.flash(
        'success',
        `Cập nhật trang thái ${id.length} bài viết thành công!`
      );

      break;
    case 'delete-all':
      await Blog.updateMany(
        { _id: { $in: id } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        }
      );

      req.flash('success', `Xóa ${id.length} bài viết thành công!`);

      break;
    case 'permanentlyDelete-all':
      await Blog.deleteMany({ _id: { $in: id } });

      req.flash('success', `Xóa vĩnh viễn ${id.length} bài viết thành công!`);

      break;
    case 'change-position':
      updatedBy.titleUpdated = 'thay đổi vị trí bài viết';
      for (const item of id) {
        let [id, position] = item.split('-');
        position = parseInt(position);

        await Blog.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy },
          }
        );
      }

      req.flash('success', `Cập nhật vị trí ${id.length} bài viết thành công!`);

      break;
    case 'recovery-all':
      updatedBy.titleUpdated = 'phục hồi bài viết';
      await Blog.updateMany(
        { _id: { $in: id } },
        {
          deleted: false,
          $push: { updatedBy: updatedBy },
        }
      );

      req.flash('success', `Khôi phục ${id.length} bài viết thành công!`);
      break;
    default:
      break;
  }

  res.redirect(req.get('Referrer') || '/');
};

// [GET] /admin/blogs/detail/:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      _id: req.params.id,
      deleted: false,
    };

    const blog = await Blog.findOne(find);

    if (blog.blog_category_id) {
      const category = await BlogCategory.findOne({
        _id: blog.blog_category_id,
      });
      blog.category = category.title;
    }

    // show create detail
    await showBlogDetailHelper.showDetailCreate(blog);

    // show edit detail
    await showBlogDetailHelper.showDetailEdit(blog);

    res.render('admin/pages/blogs/detail', {
      titlePage: blog.title,
      blog: blog,
    });
  } catch (error) {
    req.flash('error', 'Lỗi ID!');
    res.redirect(`${systemConfig.prefixAdmin}/blogs`);
  }
};
