var co = require('co'),
    route = require('koa-route'),
    TodoController = require('../controller/todo.js'),
    AuthController = require('../controller/auth.js');

/**
 * ######################################################################################
 * ######################################################################################
 * Auth Middleware
 * ######################################################################################
 * ######################################################################################
 */
function* auth(next){
    if (!this.isAuthenticated()) {
        this.status = 403;
        this.body = { success: false };
    } else {
        yield next;
    }
}

/**
 * ######################################################################################
 * ######################################################################################
 * ROUTES
 * ######################################################################################
 * ######################################################################################
 */
module.exports = function(app){
    app.use(route.post('/auth/login', AuthController.login));
    app.use(auth);
    app.use(route.post('/todo', TodoController.create));
    app.use(route.put('/todo/:id', TodoController.update));
};


