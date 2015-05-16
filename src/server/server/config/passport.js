/**
 * Created by Christian on 5/13/2015.
 */
'use strict';

var passport = require('koa-passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('../config/bcryptjs'),
    User = require('../model/user.js'),
    config = require('../config'),
    co = require('co');


passport.use(new LocalStrategy(
    co.wrap(strategy)
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id);
});
// ==========================================================================
// Use this after passport initilaize for login on development and testing
// ==========================================================================
passport.dev = function*() {
    return co.wrap(function*(req, res, next) {
        if (!config.get('forceLoginOnDev', false) &&(config.isDevelopment() || config.isTest())) {
            var user = yield User.findById(1);

            if (!user) {
                throw new Error('Test user with ID one could not be found in database');
            }

            req.logIn(user, {}, function(){
                next();
            });
        } else {
            next();
        }
    });
};

function* strategy(username, password, done){

    var user;

    if (config.isDevelopment() || config.isTest()) {
        user = yield User.findById(1);

    } else {
        try{

            user = yield User.findBy({email: username});

        } catch(err) {
            console.error(err);
        }
    }
    if (user === null) {
        return done(null, false, { message: 'Incorrect username.' });
    }


}

module.exports = passport;
