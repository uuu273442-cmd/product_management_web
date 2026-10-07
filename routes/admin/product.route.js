const express = require('express');
const multer = require('multer');

const route = express.Router();

const upload = multer();

const middleware = require('../../middlewares/admin/uploadCloudinary.middleware');
const validate = require('../../validates/admin/product.validate');
const controllerProduct = require('../../controllers/admin/product.controller');

// Product page

route.get('/', controllerProduct.index);

route.patch('/change-status/:status/:id', controllerProduct.changeStatus);

route.patch('/change-multi', controllerProduct.changeMulti);

route.delete('/deleteItem/:id', controllerProduct.deleteItem);

// End product page

// Add product page

// Create products page

route.get('/create', controllerProduct.create);

route.post(
  '/create',
  upload.single('thumbnail'),
  middleware.uploadCloudinary,
  validate.createPost,
  controllerProduct.createPost
);

// End create products page

// Edit product page

route.get('/edit/:id', controllerProduct.edit);

route.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  middleware.uploadCloudinary,
  validate.createPost,
  controllerProduct.editPatch
);

// End edit product page

// Trash page product

route.get('/trashCan', controllerProduct.trash);

route.patch('/trashCan/recovery/:id', controllerProduct.recovery);

route.patch(
  '/trashCan/change-status/:status/:id',
  controllerProduct.changeStatus
);

route.patch('/trashCan/change-multi', controllerProduct.changeMulti);

route.delete(
  '/trashCan/permanentlyDelete/:id',
  controllerProduct.permanentlyDelete
);

// End trash page product

// Detail page

route.get('/detail/:id', controllerProduct.detail);

// End detail page

module.exports = route;
