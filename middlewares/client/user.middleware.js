const User = require('../../models/user.model');

module.exports.infoUser = async (req, res, next) => {
  if (req.cookies.token_user) {
    const user = await User.findOne({
      token_user: req.cookies.token_user,
      deleted: false,
    }).select('-password');

    if (user) {
      res.locals.user = user;
    }
  }

  next();
};
