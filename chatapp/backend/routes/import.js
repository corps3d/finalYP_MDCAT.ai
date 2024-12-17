const express = require('express');
const router = express.Router();
const { importDataFromFile, importMCQsFromFile } = require('../controllers/importController');

// content store in DB
// router.post('/import-subject', importDataFromFile);


// mcqs store in DB
router.post('/import-mcqs', importMCQsFromFile);


module.exports = router;
