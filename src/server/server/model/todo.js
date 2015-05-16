/**
 * Created by Christian on 5/14/2015.
 */

var mongoose = require('../config/mongo.js'), Schema = mongoose.Schema;

var ToDo = new Schema({
    title: String,
    description: String,
    created: Date,
    alarm: Date,
    color: String
});

module.exports = mongoose.model('ToDo',ToDo);
