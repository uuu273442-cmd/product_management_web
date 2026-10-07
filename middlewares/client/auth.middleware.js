const User = require('../../models/user.model');

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token_user) {
    res.redirect(`/user/login`);
  } else {
    const user = await User.findOne({
      token_user: req.cookies.token_user,
    }).select('-password');
    if (!user) {
      res.redirect(`/user/login`);
    } else {
      res.locals.user = user;
      next();
    }
  }
};
