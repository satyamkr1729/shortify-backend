/* eslint-disable max-len */
const mysql = require('mysql');

const dbConnection = mysql.createConnection(__config.database);

dbConnection.connect((err) => {
  if (err) {
    __logger.error(`[sql_connect_error]=> ${err}`);
    console.log('[error]: database connection failed');
  } else {
    console.log('[sql]: Database connection established');
  }
});

dbConnection.on('error', (err) => {
  __logger.error(`[sql_connect_error]=> ${err}`);
  console.log(`[sql_error]: ${err}`);
});

module.exports = dbConnection;
