module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash('error', 'Vui lòng, điền vào tiêu đề!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  next();
};
