/* eslint-disable max-len */
const DbHandler = require('./dbModules/dbFunctions');
const crypto = require('crypto');

const app = {};

/**
 * @param {Object} info
 * @param {string} info.code 5 letters shortened code
 * @param {string} info.os operating system name
 * @param {string} info.browser browser name
 * @param {string} info.ip ip adress of the request
 * @param {string} info.country
 * @param {Date} info.timestamp
 * @return {Promise}
 */
app.insertVisitedUrl = function(info) {
  return new Promise((resolve, reject) => {
    const dbHandler = new DbHandler();
    dbHandler.on('inserted', (err, data) => {
      resolve({success: true, data: null});
    });
    dbHandler.on('error', (err, data) => {
      resolve({success: false, err: err});
    });
    try {
      dbHandler.insert('code_details', [info.code, info.timestamp, info.os, info.browser, info.ip, info.country]);
    } catch (err) {
      reject(new Error('[insert_visited_url_error]: '+err));
    }
  });
};

/**
 * generates code and inserts the new url
 * @param {Object} info
 * @param {string} info.url
 * @param {Date} info.time
 * @return {Promise}
 */
app.insertNewUrl = function(info) {
  return new Promise((resolve, reject) => {
    const code = crypto.createHash(__config.hash).update(info.url).digest('hex').substr(0, 5);
    const dbHandler = new DbHandler();
    dbHandler.on('inserted', (err, data) => {
      if (!err) {
        resolve({success: true, data: null});
      }
    });
    dbHandler.on('error', (err, data) => {
      resolve({success: false, err: err});
    });

    try {
      dbHandler.insert('code_url', [code, info.url, info.time]);
    } catch (err) {
      reject(new Error('[insert_new_url_error]: '+err));
    }
  });
};

/**
 * fetches details about a code
 * @param {string} code
 * @return {Promise}
 */
app.fetchCodeVisitDetails = function(code) {
  return new Promise((resolve, reject) => {
    const dbHandler = new DbHandler();
    dbHandler.on('selected', (err, data) => {
      if (data.length) {
        resolve({success: true, data: data});
      } else {
        resolve({success: false, err: 'NO_ROW'});
      }
    });
    dbHandler.on('error', (err, data) => {
      resolve({success: false, err: err});
    });
    try {
      dbHandler.select('code_details', '*', 'code_details.code=', code);
    } catch (err) {
      reject(new Error(`[fetch_code_visit_details_error]: ${err}`));
    }
  });
};

/**
 * fetches all the codes present in the database
 * @return {Promise}
 */
app.fetchAllCodeDetails = function() {
  return new Promise((resolve, reject) => {
    const dbHandler = new DbHandler();
    dbHandler.on('selected', (err, data) => {
      if (data.length) {
        resolve({success: true, data: data});
      } else {
        resolve({success: false, err: 'NO_ROW'});
      }
    });
    dbHandler.on('error', (err, data) => {
      resolve({success: false, err: err});
    });
    try {
      dbHandler.select('code_url',
          ['code_url.code ', 'code_url.url', 'code_url.timestamp', 'count(code_details.timestamp) as visit_count'],
          null, null, 'left', 'code_details', 'code_url.code = code_details.code', 'group', 'code_details.timestamp');
    } catch (error) {
      reject(new Error(`[fetch_code_visit_details_error]: ${error}`));
    }
  });
};

/**
 * fetches url for the code
 * @param {string} code
 * @return {Promise}
 */
app.fetchCodeUrl = function(code) {
  return new Promise((resolve, reject) => {
    const dbHandler = new DbHandler();
    dbHandler.on('selected', (err, data) => {
      if (data.length) {
        resolve({success: true, data: data});
      } else {
        resolve({success: false, err: 'NO_ROW'});
      }
    });

    dbHandler.on('error', (err, data) => {
      resolve({success: false, err: err});
    });
    try {
      dbHandler.select('code_url', 'url', 'code_url.code=', code);
    } catch (error) {
      reject(new Error(`[fetch_code_url_error]: ${error}`));
    }
  });
};

module.exports = app;
