const productRoutes = require('./product.route');
const homeRoutes = require('./home.route');
const searchRoutes = require('./searchRoutes.route');
const cartRoutes = require('./cart.route');
const blogRoutes = require('./blog.route');
const checkoutRoutes = require('./checkout.route');
const historyRoutes = require('./history.route');
const userRoutes = require('./user.route');
const contactRoutes = require('./contact.route');

const middlewareProductsCategory = require('../../middlewares/client/categoryMiddleware.middleware');
const middlewareCarts = require('../../middlewares/client/carts.middleware');
const middlewareUser = require('../../middlewares/client/user.middleware');
const middlewareSettingsGeneral = require('../../middlewares/client/settings.middleware');

module.exports = (app) => {
  app.use(middlewareProductsCategory.layoutProductsCategory);

  app.use(middlewareUser.infoUser);

  app.use(middlewareSettingsGeneral.getSettingsGeneral);

  app.use(middlewareCarts.cartId);

  app.use('/', homeRoutes);

  app.use('/products', productRoutes);

  app.use('/search', searchRoutes);

  app.use('/blogs', blogRoutes);

  app.use('/cart', cartRoutes);

  app.use('/checkout', checkoutRoutes);

  app.use('/user', userRoutes);

  app.use('/history', historyRoutes);

  app.use('/contact', contactRoutes);
};
