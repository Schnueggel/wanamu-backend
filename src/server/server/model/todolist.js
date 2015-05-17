/**
 * Created by Christian on 5/17/2015.
 */

/**
 *
 * @param {String} name
 * @param {Object} [options]
 * @constructor
 */
var TodoList = function(name, options) {
    var data = options || {};

    this.name = name;
    this.created = data.created || Date.now();
    if (Array.isArray(data.todos)) {
        this.todos = data.todos;
    }
};

TodoList.prototype.name = null;
TodoList.prototype.todos = [];


module.exports = {
    TodoList: TodoList,
    create: function *() {
        throw new Error('Not supported yet');
    }
};
