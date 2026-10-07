const express = require('express');

const router = express.Router();

const usersController = require('../../controllers/admin/users.controller');

router.get('/', usersController.index);

router.get('/detail/:id', usersController.detail);

router.patch('/change-status/:status/:id', usersController.changeStatus);

router.delete('/delete/:id', usersController.delete);

router.patch('/change-multi', usersController.changeMulti);

module.exports = router;
