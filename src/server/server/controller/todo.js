/**
 * Created by Christian on 5/17/2015.
 */

var TodoList = require('../model/todolist'),
    Todo = require('../model/todo'),
    ErrorUtil = require('../util/error');

function* create(todolistname){
    var input = this.request.body || {},
        result = {
            data: [],
            success: false,
            error: null
        },
        user = this.req.user,
        todo;

    var todolist = yield TodoList.findOne({where: { name: todolistname, UserId: user.id} });

    if (todolist === null) {
        result.error = new ErrorUtil.TodoListNotFound();
        this.body = result;
        return;
    }

    try {
        todo = yield Todo.create(input);
        yield todolist.addTodos([todo]);
        todo = yield todo.reload();
        result.success = true;
        result.data = todo.get({plain: true});
    } catch (err) {
        console.error(err);
        if (err instanceof Todo.Sequelize.ValidationError) {
            this.status = 422;
            result.error = err;
        } else {
            this.status = 500;
            result.error = new Error('Unable to create todo');
        }
    }

    this.body = result;
}


module.exports = {
    create: create
};
