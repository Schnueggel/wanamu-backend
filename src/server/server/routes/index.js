var co = require('co'),
    route = require('koa-route'),
    TodoController = require('../controller/todo.js'),
    AuthController = require('../controller/auth.js');

module.exports = function(app){
    app.use(route.post('/todo/:userid/:todolist', auth(TodoController.create)));
    app.use(route.post('/auth/login', AuthController.login))
};


function auth(fn){
    return function* () {
        if (!this.isAuthenticated()) {
            this.status = 403;
            this.body = { success: false }
        } else {
            console.log(fn);
            console.log(arguments);
            yield* fn.apply(this, arguments);
        }
    };
}
