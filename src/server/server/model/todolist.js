/**
 * Created by Christian on 5/14/2015.
 */

var mongoose = require('../config/mongo.js'),
    Schema = mongoose.Schema,
    User = require('./User.js'),
    Todo = require('./todo.js');

var ToDoList = new Schema({
    user: User,
    todos: [Todo]
});

module.exports = mongoose.model('ToDo',ToDoList);
