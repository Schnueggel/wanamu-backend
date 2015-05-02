var express = require('express');
var router = express.Router();


var listing = require('../controller/listing');
var toplisting = require('../controller/toplisting');

router.use('/listing', listing);
router.use('/toplisting', toplisting);

module.exports = router;
