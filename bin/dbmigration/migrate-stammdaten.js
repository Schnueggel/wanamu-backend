'use strict';

process.env.NODE_ENV = 'development';
var mysql = require('mysql'), config = require('../../src/server/server/config'),
    sequelize = config.getSequelize(),
    Salutation = require('../../src/server/server/model/lookup/salutation'),
    UserGroup = require('../../src/server/server/model/user-group'),
    Address = require('../../src/server/server/model/address'),
    User = require('../../src/server/server/model/user');

var directConnection = mysql.createConnection({
    host: 'localhost', user: 'nautic', password: 'nautic', database: 'nautic'
});

directConnection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        process.exit(1);
    }

    console.log('connected as id ' + directConnection.threadId);
});

/**
 * ######################################################################################
 * ######################################################################################
 * HERE WE START
 * ######################################################################################
 * ######################################################################################
 */
var funcs = [createSalutations, createUserGroups, createUsers, theEnd];

var i = -1,
    donext = function(){
        console.log('GO NEXT');
        i++;
        funcs[i]().then(donext).catch(errorAndExit);
    };

donext();

/**
 * ######################################################################################
 * ######################################################################################
 * MAIN FUNCTIONS
 * ######################################################################################
 * ######################################################################################
 */
function createUserGroups() {
    console.log('CREATE Usergroups');
    var groups = [];
    var p = new Promise(function(resolve){
        directConnection.query('SELECT DISTINCT gruppe FROM dat_stammdaten WHERE gruppe IS NOT NULL', function (err, gruppen) {
            if (err) {
                console.error('Error with query: ' + err.stack);
                process.exit(1);
            }

            if (!gruppen.length) {
                errorAndExit('No usergroups found');
            }

            gruppen.forEach(function(group) {
                groups.push({
                    name: group.gruppe
                });
            });

            if (!groups.length) {
                errorAndExit('No usergroups generated');
            }

            UserGroup.bulkCreate(groups).then(function () {
                console.log('CREATED UserGroups');
                resolve();
            }, function (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    resolve();
                } else {
                    errorAndExit(err);
                }
            });
        });
    });
    return p;
}

function createUsers() {
    console.log('CREATE Users');
       var p = new Promise(function(resolve) {
           var query = directConnection.query('SELECT *, AES_DECRYPT(password,\'werdqwxyxdQEgfd\') AS password_entschluesselt FROM dat_stammdaten');
           // ==========================================================================
           // https://www.npmjs.com/package/mysql#streaming-query-rows
           // ==========================================================================
           query.on('error', errorAndExit)
                .on('result', function (row) {

                   directConnection.pause();

                   var addressdata = {
                       street: row.strasse,
                       zipCode: row.plz,
                       city: row.ort,
                       phone: row.telefon,
                       mobile: row.mobil,
                       fax: row.telefax
                   };
                   var userdata = {
                       firstName: row.vorname,
                       lastName: row.nachname,
                       companyName: row.fa_name,
                       companyContact: row.fa_kontakt,
                       title: row.titel,
                       salutation: translateSalutation(row.anrede),
                       email: row.email,
                       website: row.internet,
                       oldContactId: row.alte_kontakt_id,
                       password: row.password_entschluesselt
                   };
                   createUser(userdata).then(function (user) {
                       addressdata.UserId = user.id;
                       createAddress(addressdata).then(function () {
                           directConnection.resume();
                       }).catch(errorAndExit);
                   }).catch(function(err){
                       if (err.name === 'SequelizeValidationError') {
                           console.log(err);
                           console.log(row);
                           directConnection.resume();
                       } else if (err.name === 'SequelizeUniqueConstraintError') {
                           console.log(err);
                           console.log(row);
                           directConnection.resume();
                       } else {
                           errorAndExit(err);
                       }
                   });
               });
       });
    return p;
}

function createSalutations() {
    console.log('CREATE Salutations');
    var p = new Promise(function(resolve){
        Salutation.bulkCreate([
            {name : 'Mr.'},
            {name : 'Ms.'},
            {name : 'Company'}
        ]).then(function(){
            console.log('CREATED Salutation');
            resolve();
        }).catch(function(err){
            if (err.name === 'SequelizeUniqueConstraintError') {
                resolve();
            } else {
                errorAndExit(err);
            }
        });
    });
    return p;
}

/**
 * ######################################################################################
 * ######################################################################################
 * HELPER FUNCTIONS
 * ######################################################################################
 * ######################################################################################
 */
function createUser(data) {
    var p = new Promise(function(resolve, reject){
        User.create(data).then(function(user){
            resolve(user);
        }).catch(function(err){
            reject(err);
        });
    });

    return p;
}
function createAddress(data) {
    var p = new Promise(function(resolve){
        Address.create(data).then(function (newAddress) {
            resolve(newAddress);
        }, errorAndExit);
    });

    return p;
}

function translateSalutation(old) {
    if (old === 'herr') {
        return 'Mr.';
    } else if (old === 'frau') {
        return 'Ms.';
    } else if (old === 'firma') {
        return 'Company';
    } else if (old === null) {
        return null;
    }
    errorAndExit('Wrong salutation found: ' + old);
}

function errorAndExit(err){
    console.log(err);
    process.exit(1);
}

function theEnd(){
    directConnection.end();
}

