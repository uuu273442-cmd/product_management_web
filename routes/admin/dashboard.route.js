const express = require("express");
const route = express.Router();

const controllerDashboard = require("../../controllers/admin/dashboard.controller");

route.get("/", controllerDashboard.dashboard);

module.exports = route;