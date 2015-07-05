var co = require('co'),
    route = require('koa-route'),
    TodoController = require('../controller/todo'),
    TodoListController = require('../controller/todolist'),
    UserController = require('../controller/user'),
    ProfileController = require('../controller/profile'),
    RegistrationController = require('../controller/registration'),
    SettingController = require('../controller/setting'),
    AuthController = require('../controller/auth');

/**
 * ######################################################################################
 * ######################################################################################
 * Auth Middleware
 * ######################################################################################
 * ######################################################################################
 */

/**
 * Every middleware after this one can only be accessed by an authenticated user
 * @param {Function} next
 */
function* auth(next){
    if (!this.isAuthenticated()) {
        this.status = 401;
        this.body = {
            success: false,
            error : 'Not logged in'
        };
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
    /**
     * ######################################################################################
     * ######################################################################################
     * Here are the routes that can be access without valid user
     * ######################################################################################
     * ######################################################################################
     */

    app.use(route.post('/auth/login', AuthController.login));
    app.use(route.post('/user', UserController.create));
    app.use(route.get('/confirmation/:hash', RegistrationController.confirm));
    app.use(route.post('/confirmation', RegistrationController.resendConfirmation));

    /**
     * ######################################################################################
     * ######################################################################################
     * Everything after here must be authenticated
     * ######################################################################################
     * ######################################################################################
     */
    app.use(auth);
    // ==========================================================================
    // TODOS
    // ==========================================================================
    app.use(route.post('/todo', TodoController.create));
    app.use(route.put('/todo/:id', TodoController.update));
    app.use(route.delete('/todo/:id', TodoController.delete));
    // ==========================================================================
    // TODOLIST
    // ==========================================================================
    app.use(route.get('/todolist/:id', TodoListController.get));
    app.use(route.get('/todolist', TodoListController.list));
    app.use(route.delete('/todolist/:id', TodoListController.delete));
    // ==========================================================================
    // USER
    // ==========================================================================
    app.use(route.put('/user/:id', UserController.update));
    app.use(route.get('/user/:id', UserController.get));
    // ==========================================================================
    // AUTH
    // ==========================================================================
    app.use(route.post('/auth/logout', AuthController.dologout));
    // =============================================================================================
    // Profile
    // =============================================================================================
    app.use(route.put('/profile/:id', ProfileController.update));
    app.use(route.get('/profile/:id', ProfileController.get));
    // =============================================================================================
    // Settings
    // =============================================================================================
    app.use(route.put('/setting/:id', SettingController.update));
    app.use(route.get('/setting/:id', SettingController.get));
};


