odule.exports.slugCheck = async (req, res, next) => {
  const param = req.params.slug;

  if (param === 'undefined') {
    req.flash(
      'error',
      'Lỗi sản phẩm chúng tôi sẽ khác phục sớm, rất xin lỗi vì trường hợp bất tiện này!'
    );
    res.redirect('/products');
    return;
  }

  next();
};
