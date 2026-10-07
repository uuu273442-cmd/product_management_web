const express = require('express');
const router = express.Router();

const historyController = require('../../controllers/client/history.controller');

router.get('/', historyController.index);

module.exports = router;
