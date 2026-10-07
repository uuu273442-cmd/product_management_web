const express = require('express');
const multer = require('multer');

const upload = multer();

const route = express.Router();

const controller = require('../../controllers/client/user.controller');
const validates = require('../../validates/client/user.validate');
const authMiddleware = require('../../middlewares/client/auth.middleware');
const middleware = require('../../middlewares/admin/uploadCloudinary.middleware');

route.get('/register', controller.register);

route.post('/register', validates.registerPost, controller.registerPost);

route.get('/login', controller.login);

route.post('/login', validates.loginPost, controller.loginPost);

route.get('/logout', controller.logout);

route.get('/password/forgot', controller.forgot);

route.post('/password/forgot', controller.forgotPost);

route.get('/password/otp', controller.otpPassword);

route.post('/password/otp', controller.otpPasswordPost);

route.get(
  '/password/reset',
  authMiddleware.requireAuth,
  controller.resetPassword
);

route.post(
  '/password/reset',
  authMiddleware.requireAuth,
  validates.resetPasswordPost,
  controller.resetPasswordPost
);

route.get('/info', authMiddleware.requireAuth, controller.info);

route.get('/edit', authMiddleware.requireAuth, controller.edit);

route.post(
  '/edit',
  authMiddleware.requireAuth,
  upload.single('avatar'),
  middleware.uploadCloudinary,
  controller.editPost
);

module.exports = route;
