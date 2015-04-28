var config = require('../config'),
    promise = require('promise');

module.exports = {
    getListing: function (id) {
        return new Promise(function (fulfill, reject) {
            config.getMysqlPool().getConnection(function (err, connection) {
                if(err) {
                    reject(err);
                    return;
                }
                // Use the connection
                connection.query('SELECT * FROM dat_anzeigen WHERE anzeigen_id = ?', [id], function (err, rows) {
                    if(err) {
                        reject(err);
                        return;
                    }

                    // And done with the connection.
                    connection.release();
                    return fulfill(rows[0]);

                    // Don't use the connection here, it has been returned to the pool.
                });
            });
        });
    }
}
