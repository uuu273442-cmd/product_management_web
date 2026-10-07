const express = require('express');
const multer = require('multer');

const upload = multer();

const router = express.Router();

const middleware = require('../../middlewares/admin/uploadCloudinary.middleware');
const blogsCategoryController = require('../../controllers/admin/blogs-category.controller');
const validate = require('../../validates/admin/product-category.validate');

router.get('/', blogsCategoryController.index);

router.patch(
  '/change-status/:status/:id',
  blogsCategoryController.changeStatus
);

router.delete('/deleted/:id', blogsCategoryController.deleted);

router.patch('/change-multi', blogsCategoryController.changeMulti);

router.get('/create', blogsCategoryController.create);

router.get('/detail/:id', blogsCategoryController.detail);

router.get('/edit/:id', blogsCategoryController.edit);

router.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  middleware.uploadCloudinary,
  validate.createPost,
  blogsCategoryController.editPatch
);

router.post(
  '/create',
  upload.single('thumbnail'),
  middleware.uploadCloudinary,
  validate.createPost,
  blogsCategoryController.createPost
);

router.patch(
  '/trash/change-status/:status/:id',
  blogsCategoryController.changeStatus
);

router.get('/trash', blogsCategoryController.trash);

router.patch('/trash/change-multi', blogsCategoryController.changeMulti);

router.patch('/trash/recovery/:id', blogsCategoryController.recovery);

router.delete(
  '/trash/permanent-delete/:id',
  blogsCategoryController.permanentDelete
);

module.exports = router;
