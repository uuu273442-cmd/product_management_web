const md5 = require('md5');
const sendMailHelper = require('../../helper/sendMail');

const ForgotPassword = require('../../models/forgot-password.model');
const User = require('../../models/user.model');

const orderAndCartHelper = require('../../helper/orderAndCart');

// [GET] /user/register
module.exports.register = (req, res) => {
  res.render('client/pages/user/register', {
    titlePage: 'Đăng kí tài khoản',
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const email = req.body.email;
  const emailExits = await User.findOne({
    email: email,
  });

  if (emailExits) {
    req.flash('error', 'email đã tồn tại!');
    res.redirect(req.get('/') || '/');
    return;
  }

  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();

  await orderAndCartHelper.orderAndCart(user, res, req);

  res.cookie('token_user', user.token_user);
  res.redirect('/');
};

// [GET] /user/login
module.exports.login = (req, res) => {
  res.render('client/pages/user/login', {
    titlePage: 'Đăng nhập tài khoản',
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email, deleted: false });
  if (!user) {
    req.flash('error', 'không tìm thấy tài khoản');
    return res.redirect('/user/login');
  }
  if (user.password !== md5(password)) {
    req.flash('error', 'mật khẩu không đúng');
    return res.redirect('/user/login');
  }
  if (user.status === 'inactive') {
    req.flash('error', 'tài khoản của bạn đã bị cấm');
    return res.redirect('/user/login');
  }

  await orderAndCartHelper.orderAndCart(user, res, req);

  res.cookie('token_user', user.token_user);
  res.redirect('/');
};

// [GET] /user/logout
module.exports.logout = (req, res) => {
  res.clearCookie('token_user');
  res.clearCookie('cart_id');
  res.redirect('/');
};

// [GET] /user/password/forgot
module.exports.forgot = async (req, res) => {
  res.render('client/pages/user/forgot-password', {
    titlePage: 'Lấy lại mật khẩu',
  });
};

// [POST] /user/password/forgot
module.exports.forgotPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email, deleted: false });

  if (!user) {
    req.flash('error', 'không tìm thấy người dùng');
    return res.redirect(req.get('Referrer') || '/');
  }

  const objectUser = {
    email: email,
  };

  const forgotPassword = new ForgotPassword(objectUser);
  await forgotPassword.save();

  // gủi mã
  const objectSendMail = {
    from: `từ cửa hàng thực phẩm <${process.env.EMAIL_USER}>`,
    to: objectUser.email,
    subject: 'chuyển mã OTP',
    text: 'chuyển mã OTP để đổi mật khẩu',
    html: `<h1>chuyển mã OTP để đổi mật khẩu</h1>
    <p>mã OTP: <b>${forgotPassword.otp}</b></p>
    <p>vui lòng không chia sẻ mã OTP cho người khác</p>
    <p>mã OTP sẽ hết hạn sau 2 phút</p>
    `,
  };
  sendMailHelper.sendMail(objectSendMail);
  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = (req, res) => {
  const email = req.query.email;

  res.render('client/pages/user/otp-password', {
    titlePage: 'Nhập mã OTP',
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash('error', 'mã xác nhận không đúng');
    return res.redirect(`/user/password/otp?email=${email}`);
  }

  const emailUser = await User.findOne({
    email: email,
  });
  res.cookie('token_user', emailUser.token_user);
  res.redirect(`/user/password/reset`);
};

// [GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
  res.render('client/pages/user/reset-password', {
    titlePage: 'Đổi mật khẩu',
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  try {
    await User.updateOne(
      {
        token_user: req.cookies.token_user,
      },
      {
        password: md5(req.body.password),
      }
    );
    req.flash('success', 'Đổi mật khẩu thành công');
  } catch (error) {
    req.flash('success', 'Lỗi');
  }
  res.redirect('/');
};

// [GET] /user/info
module.exports.info = (req, res) => {
  res.render('client/pages/user/info', {
    titlePage: 'Thông tin tài khoản',
  });
};

// [GET] /user/edit
module.exports.edit = (req, res) => {
  res.render('client/pages/user/edit', {
    titlePage: 'Chỉnh sửa thông tin tài khoản',
  });
};

// [POST] /user/edit
module.exports.editPost = async (req, res) => {
  await User.updateOne({ token_user: req.cookies.token_user }, req.body);
  req.flash('success', 'Cập nhật thông tin thành công');
  res.redirect('/user/info');
};
