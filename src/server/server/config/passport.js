/**
 * Created by Christian on 5/13/2015.
 */
'use strict';

var passport = require('koa-passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('../config/bcrypt.js'),
    TodoList = require('../model/todolist'),
    Todo = require('../model/todo'),
    User = require('../model/user.js'),
    ErrorUtil = require('../util/error'),
    config = require('../config'),
    co = require('co');


passport.use(new LocalStrategy(
    co.wrap(strategy)
));

/**
 * Save user id in session
 */
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

/**
 * deserialize user
 * find it under app.req.user (this.req.user) in koa app middleware
 */
passport.deserializeUser(function(id, done) {

    co(function*(){
        var user = yield User.findOne({
            where: {
                id: id
            },
            include: User.getIncludeAllOption(false)
        });

        if (user === null || user.id !== id) {
            return done(null, false);
        }
        done(null, user);
    }).catch(function(err){
        console.error(err);
        done(null, false, {message: 'Could not find User'});
    });
});

/**
 * Local Strategy
 * @param {String} username
 * @param {String} password
 * @param {Function} done
 * @returns {*}
 */
function* strategy(username, password, done){

    var user,
        userfields = User.getVisibleFields(false);

    //We need the password field for auth
    userfields.push('password');

    try{
        var options = {
            where : {
                email: username
            },
            include: User.getIncludeAllOption(false),
            attributes : userfields
        };

        user = yield User.findOne(options);
    } catch(err) {
        console.error(err.stack);
        return done(new ErrorUtil.ServerError('Could not process user login'), false, {});
    }

    if (user === null) {
        return done(new ErrorUtil.NotFound(), false, {} );
    }

    var isMatch = yield bcrypt.compare(password, user.password);

    if (!isMatch) {
        return done(new ErrorUtil.AccessViolation(), false, {});
    }

    if (!user.confirmed) {
        return done(new ErrorUtil.NotConfirmed(), false,  {});
    }

    done(null, user);
}

module.exports = passport;
