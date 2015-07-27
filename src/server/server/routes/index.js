import { AuthController, UserController, RegistrationController, SettingController } from '../controller/controller.js';

let route = require('koa-route'),
    TodoController = require('../controller/todo'),
    TodoListController = require('../controller/todolist'),
    FriendsController = require('../controller/friends'),
    ProfileController = require('../controller/profile');

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
    const authCtrl = new AuthController();
    const userCtrl = new UserController();
    const registrationCtrl = new RegistrationController();
    const settingCtrl = new SettingController();

    /**
     * ######################################################################################
     * ######################################################################################
     * Here are the routes that can be access without valid user
     * ######################################################################################
     * ######################################################################################
     */

    app.use(route.post('/auth/login', function* (next){
        yield authCtrl.login(next, this);
    }));
    app.use(route.post('/user', function *(next){
        yield userCtrl.createUser(next, this);
    }));
    app.use(route.get('/confirmation/:hash', function *(hash, next) {
        yield registrationCtrl.confirmRegistration(hash, next, this);
    }));
    app.use(route.post('/confirmation', function *(next) {
        yield registrationCtrl.resendConfirmation(next, this);
    }));

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
    app.use(route.put('/user/:id', function* (id, next) {
        yield userCtrl.updateUser(id, next, this);
    }));
    app.use(route.get('/user/:id', function* (id, next){
        yield userCtrl.getUser(id, next, this);
    }));
    // ==========================================================================
    // AUTH
    // ==========================================================================
    app.use(route.post('/auth/logout', function* (next) {
        yield authCtrl.doLogout(next, this);
    }));
    // =============================================================================================
    // Profile
    // =============================================================================================
    app.use(route.put('/profile/:id', ProfileController.update));
    app.use(route.get('/profile/:id', ProfileController.get));
    // =============================================================================================
    // Settings
    // =============================================================================================
    app.use(route.put('/setting/:id', function*(id, next){
        yield settingCtrl.updateSetting(id, next, this);
    }));
    app.use(route.get('/setting/:id', function*(id, next){
        yield settingCtrl.getSetting(id, next, this);
    }));
    // =============================================================================================
    // Friends
    // =============================================================================================
    app.use(route.get('/friends', FriendsController.list));
};


