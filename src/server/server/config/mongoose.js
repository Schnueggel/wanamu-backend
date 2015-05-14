/**
 * Created by Christian on 5/14/2015.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todoit');


module.exports = mongoose;
