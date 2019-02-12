var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "noumena",
  database: "auth_login"
});

connection.connect();
module.exports = connection;
