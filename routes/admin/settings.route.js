const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer();

const controller = require('../../controllers/admin/settings.controller');
const middleware = require('../../middlewares/admin/uploadCloudinary.middleware');

router.get('/general', controller.index);

router.patch(
  '/general',
  upload.single('logo'),
  middleware.uploadCloudinary,
  controller.updateGeneral
)

module.exports = router;