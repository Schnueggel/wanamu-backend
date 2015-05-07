'use strict';

process.env.NODE_ENV = 'development';
var mysql = require('mysql'),
    config = require('../../src/server/server/config'),
    sequelize = config.getSequelize(),
    Salutation = require('../../src/server/server/model/lookup/salutation'),
    User = require('../../src/server/server/model/user');


var directConnection = mysql.createConnection({
    host: 'localhost',
    user: 'nauticlive',
    password: 'nauticlive',
    database: 'nauticlive'
});

directConnection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        process.exit(1);
    }

    console.log('connected as id ' + directConnection.threadId);
});

// Convert Salutations
directConnection.query('SELECT DISTINCT anrede FROM dat_stammdaten WHERE anrede IS NOT NULL', function (err, salutations) {
    if (err) {
        console.error('Error with query: ' + err.stack);
        process.exit(1);
    }
    function createSalutations(salutations) {
        if (!salutations.length) return;
        var anrede = salutations.pop(),
            salutation = {
                salutation: anrede.anrede
            };
        Salutation.create(salutation).then(function () {
            createSalutations(salutations);
        }, function (err) {
            console.error('Error inserting salutation: ' + err);
            process.exit(1);
        });
    }

    createSalutations(salutations);

});


directConnection.end();
