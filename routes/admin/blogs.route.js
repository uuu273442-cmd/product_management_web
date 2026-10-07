const express = require('express');
const multer = require('multer');

const route = express.Router();

const upload = multer();

const middleware = require('../../middlewares/admin/uploadCloudinary.middleware');
const validate = require('../../validates/admin/product.validate');
const controllerBlogs = require('../../controllers/admin/blogs.controller');

// Blog page

route.get('/', controllerBlogs.index);

route.patch('/change-status/:status/:id', controllerBlogs.changeStatus);

route.patch('/change-multi', controllerBlogs.changeMulti);

route.delete('/deleteItem/:id', controllerBlogs.deleteItem);

// End blog page

// Add blog page

// Create blogs page

route.get('/create', controllerBlogs.create);

route.post(
  '/create',
  upload.single('thumbnail'),
  middleware.uploadCloudinary,
  validate.createPost,
  controllerBlogs.createPost
);

// End create blogs page

// Edit blog page

route.get('/edit/:id', controllerBlogs.edit);

route.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  middleware.uploadCloudinary,
  validate.createPost,
  controllerBlogs.editPatch
);

// End edit blog page

// Trash page blog

route.get('/trash', controllerBlogs.trash);

route.patch('/trash/recovery/:id', controllerBlogs.recovery);

route.patch(
  '/trash/change-status/:status/:id',
  controllerBlogs.changeStatus
);

route.patch('/trash/change-multi', controllerBlogs.changeMulti);

route.delete(
  '/trash/permanentlyDelete/:id',
  controllerBlogs.permanentlyDelete
);

// End trash page blog

// Detail page

route.get('/detail/:id', controllerBlogs.detail);

// End detail page

module.exports = route;
