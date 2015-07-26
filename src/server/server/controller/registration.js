'use strict';

let User = require('../model/user'),
    Registration = require('../model/registration'),
    Profile = require('../model/profile'),
    mailService = require('../services/mail'),
    bcrypt = require('../config/bcrypt'),
    util = require('../util/util'),
    ErrorUtil = require('../util/error');


export class RegistrationController {
    /**
     * ######################################################################################
     * ######################################################################################
     * Confirms a registration with the confirmation hash
     * Sends status codes
     * 404 User not found
     * ######################################################################################
     * ######################################################################################
     */
    *confirmRegistration(hash) {
        let user,
            result = {
                error: null,
                success: false,
                data: []
            };

        this.body = result;

        user = yield User.findOne({
            include: [
                {
                    model: Profile
                },
                {
                    model: Registration,
                    where: {
                        confirmhash: hash
                    }
                }
            ]
        });

        if (!user) {
            this.status = 404;
            result.error = new ErrorUtil.NotFound();
            return;
        }

        if (!user.confirmed) {
            yield user.updateAttributes({
                confirmed: 1
            });
            yield user.Registration.updateAttributes({
                lastconfirmation: user.sequelize.fn('NOW')
            });
            mailService.sendConfirmationSuccessMail(user.email, user.Profile);
        }

        result.success = true;
    }


    /**
     * ######################################################################################
     * ######################################################################################
     * Resends confirmation needs email and password
     * Send Status codes
     * 404 User not found
     * 412 User password mismatch
     * ######################################################################################
     * ######################################################################################
     */
    *resendConfirmation() {
        let input = this.request.body || {},
            result = {
                data: [],
                success: false,
                error: null
            },
            user,
            isAdmin = this.req.user && this.req.user.isAdmin(),
            data = input.data || {};

        this.body = result;

        user = yield User.findOne({
            where: {
                email: data.email
            },
            include: [
                {
                    model: Profile
                },
                {
                    model: Registration
                }
            ]
        });

        if (!user) {
            this.status = 404;
            result.error = new ErrorUtil.NotFound();
            return;
        }

        if (user.confirmed) {
            this.status = 208;
            result.error = new ErrorUtil.AlreadyReported();
            return;
        }
        // =============================================================================================
        // Check if password matches
        // =============================================================================================
        let isMatch = yield bcrypt.compare(data.password, user.password);
        if (!isMatch && !isAdmin) {
            this.status = 412;
            result.error = new ErrorUtil.NotIdentified('Please check your credentials');
            return;
        }

        let registration = user.Registration;
        // =============================================================================================
        // We check the time diff in seconds between the last request for confirmation and now
        // =============================================================================================
        let datediff = 1000000;

        if (registration.lastconfirmation instanceof Date) {
            datediff = (new Date()).getTime() - registration.lastconfirmation.getTime();
            datediff = datediff / 1000;
        }

        // =============================================================================================
        // If request comes to offen we throttle the requests
        // TODO not sure if this make sense. Perhaps look for something like failtoban for nodejs
        // =============================================================================================
        if (datediff < 10) {
            yield util.sleep(10000);
        } else if (datediff < 60) {
            yield util.sleep(5000);
        } else if (datediff < 120) {
            yield util.sleep(3000);
        }

        // =============================================================================================
        // Resend mail only every 10 minutes
        // =============================================================================================
        if (datediff > 600) {
            yield registration.updateAttributes({
                lastconfirmation: user.sequelize.fn('NOW')
            });
            mailService.sendConfirmationMail(user, registration);
        }

        result.success = true;
    }
}

