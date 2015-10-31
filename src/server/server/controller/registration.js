'use strict';

import User from '../model/user';
import Registration from '../model/registration';
import Profile from '../model/profile';
import bcrypt from '../config/bcrypt';
import util from '../util/util';
import ErrorUtil from '../util/error';
import mailService from '../services/mail.js';

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
    *confirmRegistration(hash, next, context) {
        const result = {
                error: null,
                success: false,
                data: []
            };

        context.body = result;

        const user = yield User.findOne({
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
            context.status = 404;
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
    *resendConfirmation(next, context) {
        const input = context.request.body || {},
            result = {
                data: [],
                success: false,
                error: null
            },
            isAdmin = context.req.user && context.req.user.isAdmin(),
            data = input.data || {};

        context.body = result;

        const user = yield User.findOne({
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
            context.status = 404;
            result.error = new ErrorUtil.NotFound();
            return;
        }

        if (user.confirmed) {
            context.status = 208;
            result.error = new ErrorUtil.AlreadyReported();
            return;
        }
        // =============================================================================================
        // Check if password matches
        // =============================================================================================
        const isMatch = yield bcrypt.compare(data.password, user.password);
        if (isMatch === false && isAdmin === false) {
            context.status = 412;
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

