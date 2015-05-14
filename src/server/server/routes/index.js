var express = require('express'),
    router = express.Router(),
    TodoListController = require('../controller/todolist.js'),
    passport = require('../config/passport.js'),
    co = require('co');

module.exports = router;

router.route('/todolist')
    .put(auth(TodoListController.update))
    .get(TodoListController.get);

router.route('/todolist/:id')
    .put(auth(TodoListController.update))
    .get(TodoListController.get);

/**
 * ######################################################################################
 * ######################################################################################
 * Authentication and Login
 * ######################################################################################
 * ######################################################################################
 */
router.route('/login').post(function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.session.messages =  [info.message];
            return res.status(401).send({message:'User could not be authenticated'});
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.status(200).send({message: 'Login success!'});
        });
    });
});

router.route('/logout').get(function(req, res){
    req.logout();
    res.send({message: 'Logout successful!'});
});

/**
 * ######################################################################################
 * ######################################################################################
 * HELPER FUNCTIONS
 * ######################################################################################
 * ######################################################################################
 */

/**
 * This helps to auth per route
 * @param {Function} action Controller Action
 * @param {Array} [userGroups] array with user groups. This is optional. If only a valid user is required for a action leave this
 */
function auth (action, userGroups) {
    return co.wrap(function*(req, res, next) {
        if (!req.isAuthenticated() || !req.user) {
            // Not sure if this is the way to do it with Angular
            res.set('X-Auth-Required', 'true');
            req.session.returnUrl = req.originalUrl;
            res.send(403);
            next();
            return;
        }
        // ==========================================================================
        // Check the usergroup name.
        // TODO perhaps better make the name the primary key this way we dont need to query for user and it is more verbose
        // ==========================================================================
        var group = yield req.user.getUserGroup();

        // ==========================================================================
        // Admin can do anything
        // ==========================================================================
        if (group.name === 'admin') {
            action(req, res, next);
            return;
        }

        // ==========================================================================
        // This check simply for usergroup name
        // TODO This can be replaced by some more powerful acl later. (If needed)
        // ==========================================================================
        if (!userGroups || userGroups.indexOf(group.name) === -1) {
            res.set('X-Auth-Required', 'true');
            req.session.returnUrl = req.originalUrl;
            res.send(401);
            next();
            return;
        }

        action(req, res, next);
    });
}
