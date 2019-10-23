/* eslint-disable max-len */
const mysql = require('mysql');

const dbConnection = mysql.createConnection(__config.database);

dbConnection.connect((err) => {
  if (err) {
    console.log('[error]: database connection failed');
  } else {
    console.log('[sql]: Database connection established');
  }
});

dbConnection.on('error', (err) => {
  console.log(`[sql_error]: ${err}`);
});

module.exports = dbConnection;
