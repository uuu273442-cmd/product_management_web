const SettingsGeneral = require('../../models/settings-general.model');

module.exports.getSettingsGeneral = async (req, res, next) => {
  const settingsGeneral = await SettingsGeneral.findOne({});
  res.locals.settingsGeneral = settingsGeneral;
  next();
};