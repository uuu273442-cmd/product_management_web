const express = require('express');
const route = express.Router();

const controllerSearch = require('../../controllers/client/search.controller');

route.get('/', controllerSearch.index);

module.exports = route;
