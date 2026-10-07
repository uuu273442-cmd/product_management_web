const Blog = require('../../models/blog.model');
const BlogCategory = require('../../models/blog-category.model');

const helperGetSubCategory = require('../../helper/products-category');

// [GET] /blogs
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
    status: 'active',
  };
  const blogs = await Blog.find(find).sort({ position: 'desc' });
  for (let blog of blogs) {
    blog.description = blog.description.slice(0, 100) + '...';
  }
  res.render('client/pages/blogs/index', {
    titlePage: 'Trang tin tức',
    blogs: blogs,
  });
};

// [GET] /blogs/detail/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      status: 'active',
      slug: req.params.slug,
    };

    const blog = await Blog.findOne(find);
    if (blog.blog_category_id) {
      const category = await BlogCategory.findOne({
        _id: blog.blog_category_id,
        status: 'actives',
        deleted: false,
      });
      blog.category = category;
    }
    res.render('client/pages/blogs/detail', {
      titlePage: blog.title,
      blog: blog,
    });
  } catch (error) {
    req.flash('error', 'Lỗi!');
    res.redirect(req.get('Referrer') || '/');
  }
};

// [GET] /blogs/:slug_category
module.exports.slugCategory = async (req, res) => {
  try {
    const slug = req.params.slug_category;
    const blogCategory = await BlogCategory.findOne({
      slug: slug,
      deleted: false,
      status: 'active',
    });
    const listSubCategory = await helperGetSubCategory.getSubCategoryBlogs(
      blogCategory.id
    );
    const listSubCategoryId = listSubCategory.map((item) => item.id);

    const blogs = await Blog.find({
      blog_category_id: { $in: [blogCategory.id, ...listSubCategoryId] },
      deleted: false,
      status: 'active',
    }).sort({ position: 'desc' });

    res.render('client/pages/blogs/index', {
      titlePage: blogCategory.title,
      blogs: blogs,
    });
  } catch (error) {
    req.flash('error', 'không tìm thấy!');
    res.redirect('\blogs');
  }
};
