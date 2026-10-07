const express = require('express');
const multer = require('multer');

const upload = multer();
const router = express.Router();

const myAccountController = require('../../controllers/admin/my-account.controller');
const middleware = require('../../middlewares/admin/uploadCloudinary.middleware');
const validate = require('../../validates/admin/accounts.validate');

router.get('/', myAccountController.index);

router.get('/edit', myAccountController.edit);

router.patch(
  '/edit',
  upload.single('avatar'),
  middleware.uploadCloudinary,
  validate.editPatch,
  myAccountController.editPatch
);

module.exports = router;
