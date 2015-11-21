import { AuthController, UserController, RegistrationController, SettingController,
    TodoController, FriendsController, ProfileController, TodoListController } from '../controller/controller.js';

import route from 'koa-route';
import convert from 'koa-convert';

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
const auth = async function(ctx, next) {
    if (!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {
            success: false,
            error: 'Not logged in'
        };
    } else {
        await next();
    }
}

/**
 * ######################################################################################
 * ######################################################################################
 * ROUTES
 * ######################################################################################
 * ######################################################################################
 */
module.exports = function (app) {
    const authCtrl = new AuthController();
    const userCtrl = new UserController();
    const registrationCtrl = new RegistrationController();
    const settingCtrl = new SettingController();
    const todoCtrl = new TodoController();
    const profileCtrl = new ProfileController();
    const friendsCtrl = new FriendsController();
    const todolistCtrl = new TodoListController();

    /**
     * ######################################################################################
     * ######################################################################################
     * Here are the routes that can be access without valid user
     * ######################################################################################
     * ######################################################################################
     */

    app.use(convert(route.post('/auth/login', function* (next) {
        yield authCtrl.login(next, this);
    })));
    app.use(convert(route.post('/user', function *(next) {
        yield userCtrl.createUser(next, this);
    })));
    app.use(convert(route.get('/confirmation/:hash', function *(hash, next) {
        yield registrationCtrl.confirmRegistration(hash, next, this);
    })));
    app.use(convert(route.post('/confirmation', function *(next) {
        yield registrationCtrl.resendConfirmation(next, this);
    })));

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
    app.use(convert(route.post('/todo', function* (next) {
        yield todoCtrl.create(next, this);
    })));
    app.use(convert(route.put('/todo/:id', function* (id, next) {
        yield todoCtrl.update(id, next, this);
    })));
    app.use(convert(route.delete('/todo/:id', function* (id, next) {
        yield todoCtrl.deleteTodo(id, next, this);
    })));
    // ==========================================================================
    // TODOLIST
    // ==========================================================================
    app.use(convert(route.get('/todolist/:id', function*(id, next) {
        yield todolistCtrl.getTodolist(id, next, this);
    })));
    app.use(convert(route.get('/todolist', function*(next) {
        yield todolistCtrl.listTodolist(next, this);
    })));
    app.use(convert(route.delete('/todolist/:id', function*(id, next) {
        yield todolistCtrl.deleteTodoList(id, next, this);
    })));

    // ==========================================================================
    // USER
    // ==========================================================================
    app.use(convert(route.put('/user/:id', function* (id, next) {
        yield userCtrl.updateUser(id, next, this);
    })));
    app.use(convert(route.get('/user/:id', function* (id, next) {
        yield userCtrl.getUser(id, next, this);
    })));
    // ==========================================================================
    // AUTH
    // ==========================================================================
    app.use(convert(route.post('/auth/logout', function* (next) {
        yield authCtrl.doLogout(next, this);
    })));
    // =============================================================================================
    // Profile
    // =============================================================================================
    app.use(convert(route.put('/profile/:id', function*(id, next) {
        yield profileCtrl.updateProfile(id, next, this);
    })));
    app.use(convert(route.get('/profile/:id', function*(id, next) {
        yield profileCtrl.getProfile(id, next, this);
    })));
    // =============================================================================================
    // Settings
    // =============================================================================================
    app.use(convert(route.put('/setting/:id', function*(id, next) {
        yield settingCtrl.updateSetting(id, next, this);
    })));
    app.use(convert(route.get('/setting/:id', function*(id, next) {
        yield settingCtrl.getSetting(id, next, this);
    })));
    // =============================================================================================
    // Friends
    // =============================================================================================
    app.use(convert(route.get('/friend', function* (next) {
        yield friendsCtrl.getList(next, this);
    })));
    app.use(convert(route.post('/friend', function* (next) {
        yield friendsCtrl.addFriend(next, this);
    })));
    app.use(convert(route.delete('/friend/:id', function* (id, next) {
        yield friendsCtrl.remove(id, next, this);
    })));
    app.use(convert(route.get('/acceptfriend/:token', function* (token, next) {
        yield friendsCtrl.accept(token, next, this);
    })));
};


