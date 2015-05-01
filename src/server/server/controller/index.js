var express = require('express');
var router = express.Router();


var listing = require('./listing');
var toplisting = require('./toplisting');

router.use('/listing', listing);
router.use('/toplisting', toplisting);

module.exports = router;
