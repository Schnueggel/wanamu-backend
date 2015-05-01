var config = require('../config'),
    promise = require('promise');

module.exports = {
    getAll: function () {
        return new Promise(function (fulfill, reject) {
            config.getMysqlPool().getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                    return;
                }
                // Use the connection
                connection.query('SELECT * FROM dat_anzeigen, dat_topview WHERE dat_topview.anzeigen_id = dat_anzeigen.anzeigen_id', function (err, rows) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // And done with the connection.
                    connection.release();
                    return fulfill(rows);

                    // Don't use the connection here, it has been returned to the pool.
                });
            });
        });
    }

}
