const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reports');

router.get('/', reportController.getReports);
router.get('/pdf', reportController.generatePDF);
router.get('/excel', reportController.generateExcel);

module.exports = router;