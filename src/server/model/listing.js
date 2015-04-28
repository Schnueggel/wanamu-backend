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
    },

    deleteListing: function (id) {
        return new Promise(function (fulfill, reject) {
            config.getMysqlPool().getConnection(function (err, connection) {
                if(err) {
                    reject(err);
                    return;
                }
                // Use the connection
                connection.query('DELETE FROM dat_anzeigen WHERE anzeigen_id = ?', [id], function (err, result) {
                    if(err) {
                        reject(err);
                        return;
                    }

                    // And done with the connection.
                    connection.release();
                    return fulfill(result.affectedRows);

                    // Don't use the connection here, it has been returned to the pool.
                });
            });
        });
    }

    //Insert
    //GetListings (Limit, Offset)
    // Limit und Offset, Maxresult müssen auch zurückgegeben werden, Kontrollobjekt für AngularJS
    // { limit : 10, offset: 20, maxresult : 50, data : rows }
    // Für alle Rückgaben implementieren

}
