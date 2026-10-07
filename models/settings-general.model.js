const mongoose = require('mongoose');

const settingsGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    facebook: String,
    email: String,
    address: String,
    copyright: String,
  },
  {
    timestamps: true,
  }
);

const SettingsGeneral = mongoose.model(
  'SettingsGeneral',
  settingsGeneralSchema,
  'settings-general'
);

module.exports = SettingsGeneral;
