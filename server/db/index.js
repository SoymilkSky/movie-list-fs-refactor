const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'movielist'
});

connection.connect((err) => {
  if (err) { return err; }
  console.log('successfully connected to movielist database');
});

module.exports = connection;