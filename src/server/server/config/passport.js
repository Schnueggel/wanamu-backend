/**
 * Created by Christian on 5/13/2015.
 */
'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
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

    User.findOne(id, {
        include: [{all: true, nested: true}]
    }).then(function(user){
        done(null, user);
    }).catch(function(err){
        done(err, null);
    });
});
// ==========================================================================
// Use this after passport initilaize for login on development and testing
// ==========================================================================
passport.dev = function() {
    return co.wrap(function*(req, res, next) {
        if (!config.get('forceLoginOnDev', false) &&(config.isDevelopment() || config.isTest())) {
            var user = yield User.findOne(1, {
                include: [{all: true, nested: true}]
            });

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
    var condition = {
        where : {
            $or : [
                {email: username},
                {customerNumber: username}
            ]
        }
    };

    if (config.isDevelopment() || config.isTest()) {
        condition.where.$or.push({id:1});
    }

    try{
        var user = yield User.findOne(condition, {
            include: [{all: true, nested: true}]
        });
        if (user === null) {
            throw new Error('User not found');
        }
    } catch(err){
        console.error(err);
        return done(null, false, { message: 'Incorrect username.' });
    }

    // ==========================================================================
    // TODO validate Password
    // ==========================================================================
    //if (!user.validPassword(password)) {
    //    return done(null, false, { message: 'Incorrect password.' });
    //}
}

module.exports = passport;
