const express = require('express');
const multer = require('multer');

const upload = multer();

const router = express.Router();

const middleware = require('../../middlewares/admin/uploadCloudinary.middleware');
const productCategoryController = require('../../controllers/admin/product-category.controller');
const validate = require('../../validates/admin/product-category.validate');

router.get('/', productCategoryController.index);

router.patch(
  '/change-status/:status/:id',
  productCategoryController.changeStatus
);

router.delete('/deleted/:id', productCategoryController.deleted);

router.patch('/change-multi', productCategoryController.changeMulti);

router.get('/create', productCategoryController.create);

router.get('/detail/:id', productCategoryController.detail);

router.get('/edit/:id', productCategoryController.edit);

router.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  middleware.uploadCloudinary,
  validate.createPost,
  productCategoryController.editPatch
);

router.post(
  '/create',
  upload.single('thumbnail'),
  middleware.uploadCloudinary,
  validate.createPost,
  productCategoryController.createPost
);

router.patch(
  '/trash/change-status/:status/:id',
  productCategoryController.changeStatus
);

router.get('/trash', productCategoryController.trash);

router.patch('/trash/change-multi', productCategoryController.changeMulti);

router.patch('/trash/recovery/:id', productCategoryController.recovery);

router.delete(
  '/trash/permanent-delete/:id',
  productCategoryController.permanentDelete
);

module.exports = router;
