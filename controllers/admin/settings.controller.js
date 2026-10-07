const SettingsGeneral = require('../../models/settings-general.model');

const systemConfig = require('../../config/system');

// [GET] /admin/settings/general
module.exports.index = async (req, res) => {
  const record = await SettingsGeneral.findOne({});
  res.render('admin/pages/settings/general', {
    titlePage: 'Cấu hình chung',
    record: record,
  });
};

// [PATCH] /admin/settings/general
module.exports.updateGeneral = async (req, res) => {
  try {
    const record = await SettingsGeneral.findOne({});
    if (record) {
      await SettingsGeneral.updateOne({ _id: record.id }, req.body);
    } else {
      const settingsGeneral = new SettingsGeneral(req.body);
      await settingsGeneral.save();
    }
    req.flash('success', 'Cập nhật thành công!');
  } catch (error) {
    req.flash('error', 'Cập nhật thất bại!');
  }
  res.redirect(`${systemConfig.prefixAdmin}/settings/general`);
};
