// routes/index.js

const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('../controllers/homeController');
const dashboardController = require('../controllers/dashboardController');
const registerController = require('../controllers/registerController');
const alltaskController = require('../controllers/alltaskController');
const completedtaskController = require('../controllers/completedtaskController');

// Log router loading
console.log('✅ Router loaded');

// Route Definitions
router.get('/', homeController.home);
router.get('/dashboard', dashboardController.dashboard);
router.get('/register', registerController.register);
router.get('/alltask', alltaskController.alltask);
router.get('/completedtask', completedtaskController.completedtask);

module.exports = router;
