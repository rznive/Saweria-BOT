const express = require('express');
const router = express.Router();
const getBalanceSaldo = require('../controllers/getBalance');

router.get('/', getBalanceSaldo);
module.exports = router;