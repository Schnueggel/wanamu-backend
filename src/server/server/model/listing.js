'use strict';

var config = require('../config');

module.exports = {
    foo: function() {
        console.log('bar');
    },
    getListing: function (id) {
        //return getListings({limit: 1, offset: 0, id:id});
        return new Promise(function (fulfill, reject) {
            config.getMysqlPool().getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                    return;
                }
                // Use the connection
                connection.query('SELECT * FROM dat_anzeigen WHERE anzeigen_id = ?', [id], function (err, rows) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // And done with the connection.
                    connection.release();

                    var response = {};

                    if (rows[0]) {
                        response.limit = 1;
                        response.data = rows[0];
                    } else {
                        response = false;
                    }


                    return fulfill(response);

                    // Don't use the connection here, it has been returned to the pool.
                });
            });
        });
    },

    deleteListing: function (id) {
        return new Promise(function (fulfill, reject) {
            config.getMysqlPool().getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                    return;
                }
                // Use the connection
                connection.query('DELETE FROM dat_anzeigen WHERE anzeigen_id = ?', [id], function (err, result) {
                    if (err) {
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
    },

    getListings: function (limit, offset) {
        return new Promise(function (fulfill, reject) {
            limit = parseInt(limit) || 10;
            offset = parseInt(offset) || 0;

            config.getMysqlPool().getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                    return;
                }
                // Use the connection
                var sql = 'SELECT * FROM dat_anzeigen LIMIT ' + offset + ',' + limit;
                connection.query(sql, function (err, rows) {
                    if (err) {
                        reject(err);
                        return;
                    }


                    connection.query('SELECT COUNT(*) AS anzahl FROM dat_anzeigen', function (err, count) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        // And done with the connection.
                        connection.release();

                        var response = {};
                        response.maxresult = count[0].anzahl;
                        response.limit = limit;
                        response.offset = offset;
                        response.data = rows;


                        return fulfill(response);

                        // Don't use the connection here, it has been returned to the pool.
                    });

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
