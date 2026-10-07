const express = require('express');

const controllerBlogs = require('../../controllers/client/blog.controller');

const route = express.Router();

route.get('/', controllerBlogs.index);

route.get('/detail/:slug', controllerBlogs.detail);

route.get('/:slug_category', controllerBlogs.slugCategory);

module.exports = route;
