const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const productCategoryRoutes = require('./products-category.route');
const rolesRoutes = require('./role.route');
const accountsRoutes = require('./accounts.route');
const authRoutes = require('./auth.route');
const myAccount = require('./myAccount.route');
const replacePassword = require('./replacePassword.route');
const blogRoutes = require('./blogs.route');
const blogCategoryRoutes = require('./blogs-category.route');
const checkoutRoutes = require('./checkout.route');
const usersRoutes = require('./users.routes');
const settingsGeneralRoutes = require('./settings.route');

const authMiddleware = require('../../middlewares/admin/auth.middleware');

const systemConfig = require('../../config/system');

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    PATH_ADMIN + '/dashboard',
    authMiddleware.requireAuth,
    dashboardRoutes
  );

  app.use(PATH_ADMIN + '/products', authMiddleware.requireAuth, productRoutes);

  app.use(
    PATH_ADMIN + '/products-category',
    authMiddleware.requireAuth,
    productCategoryRoutes
  );

  app.use(PATH_ADMIN + '/roles', authMiddleware.requireAuth, rolesRoutes);

  app.use(PATH_ADMIN + '/accounts', authMiddleware.requireAuth, accountsRoutes);

  app.use(PATH_ADMIN + '/my-account', authMiddleware.requireAuth, myAccount);

  app.use(
    PATH_ADMIN + '/replace-password',
    authMiddleware.requireAuth,
    replacePassword
  );

  app.use(PATH_ADMIN + '/blogs', authMiddleware.requireAuth, blogRoutes);

  app.use(
    PATH_ADMIN + '/blogs-category',
    authMiddleware.requireAuth,
    blogCategoryRoutes
  );

  app.use(PATH_ADMIN + '/auth', authRoutes);

  app.use(PATH_ADMIN + '/checkout', authMiddleware.requireAuth, checkoutRoutes);

  app.use(PATH_ADMIN + '/users', authMiddleware.requireAuth, usersRoutes);

  app.use(
    PATH_ADMIN + '/settings',
    authMiddleware.requireAuth,
    settingsGeneralRoutes
  );
};
