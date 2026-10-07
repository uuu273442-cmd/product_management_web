const express = require('express');
const router = express.Router();

const authController = require('../../controllers/admin/auth.controller');
const validatesLogin = require('../../validates/admin/auth.validate');

router.get('/login', validatesLogin.index, authController.index);

router.post('/login', validatesLogin.loginPost, authController.loginPost);

router.get('/logout', authController.logout);

module.exports = router;
