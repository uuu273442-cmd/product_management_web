const express = require('express');
const router = express.Router();

const replacePassword = require('../../controllers/admin/replace-password.controller');
const validate = require('../../validates/admin/accounts.validate');

router.get('/', replacePassword.index);

router.patch('/edit', validate.editPatchPassword, replacePassword.editPatch);

module.exports = router;
