/* eslint-disable max-len */
const mysql = require('mysql');

const dbConnection = mysql.createConnection(__config.database);

dbConnection.connect((err) => {
  if (err) {
    console.log('[error]: database connection failed');
  } else {
    console.log('Database connection established');
  }
});

dbConnection.on('error', (err) => {
  console.log(err);
});

module.exports = dbConnection;
