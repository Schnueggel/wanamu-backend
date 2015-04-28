var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'nautic',
    password: 'nautic'
});

function handleConnectionError(err) {
    console.log(err);
}

module.exports = {
  getListing : function(id) {
      connection.connect(function(err) {
          if(err) {
              handleConnectionError(err);
              return;
          }
      });

      var post  = {id: 1, title: 'Hello MySQL'};
      var query = connection.query('INSERT INTO posts SET ?', post, function(err, result) {
          // Neat!
      });
      console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'

  }
};
