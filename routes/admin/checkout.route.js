const express = require('express');
const router = express.Router();

const checkoutController = require('../../controllers/admin/checkout.controller');

router.get('/', checkoutController.index);

router.get('/:id', checkoutController.detail);

router.patch('/:id/status', checkoutController.updateStatus);

module.exports = router