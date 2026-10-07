const mongoose = require('mongoose');
const helperGenerate = require('../helper/generate');

const forgotPasswordSchema = new mongoose.Schema({
  email: String,
  otp: {
    type: String,
    default: helperGenerate.generateRandomNumber(8),
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: 120 },
  },
});

const ForgotPassword = mongoose.model(
  'ForgotPassword',
  forgotPasswordSchema,
  'forgot-password'
);

module.exports = ForgotPassword;
