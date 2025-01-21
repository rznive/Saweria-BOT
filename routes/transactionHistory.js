const express = require('express');
const router = express.Router();
const getTransaction = require('../controllers/getTransaction');

router.get('/', getTransaction);
module.exports = router;