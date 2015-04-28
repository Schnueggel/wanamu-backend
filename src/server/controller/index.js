var express = require('express');
var router = express.Router();


var listing = require('./listing');

router.use('/listing', listing);

module.exports = router;
