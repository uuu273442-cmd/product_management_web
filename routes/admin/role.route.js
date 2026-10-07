const express = require('express');
const router = express.Router();

const roleController = require('../../controllers/admin/role.controller');

router.get('/', roleController.index);

router.get('/create', roleController.create);

router.post('/create', roleController.createPost);

router.get('/detail/:id', roleController.detail);

router.get('/edit/:id', roleController.edit);

router.patch('/edit/:id', roleController.editPatch);

router.delete('/deleted/:id', roleController.delete);

router.get('/permission', roleController.permission);

router.patch('/permission', roleController.permissionPatch);

router.patch('/change-multi', roleController.changeMulti);

module.exports = router;