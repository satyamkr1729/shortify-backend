const Express = require('express');
const bodyParser = require('body-parser');
const readConfig = require('jsonfile').readFileSync;
const appFunc = require('./appFunctions');
const logger = require('log4js');
const cors = require('cors');

// get configurations
try {
  global.__config = readConfig('config.json');
} catch (e) {
  __logger.error(`Server configuration not found`);
  console.log('[error]=> Server configuration not found');
}

// configure logger
logger.configure({
  appenders: {
    everything: {type: 'file', filename: __config.error_log_file},
  },
  categories: {
    default: {appenders: ['everything'], level: 'error'},
  },
});
global.__logger = logger.getLogger();

// connect to database
const dbConnect = require('./dbModules/dbConnect');
global.__connect = dbConnect;

const app = new Express();

app.use(bodyParser.json());

// configure cors
const corsOptions = {
  origin: function(origin, callback) {
    callback(null, __config.whiteListUrls.indexOf(origin) != -1);
  },
};

app.use(cors(corsOptions));

app.post('/url', (req, res, next) => {
  let url = '';
  appFunc.fetchCodeUrl(req.query.code).then((response) => {
    if (response.success) {
      url = response.data[0].url;
      return appFunc.insertVisitedUrl({
        code: req.query.code,
        os: req.body.os,
        browser: req.body.browser,
        ip: req.body.ip,
        country: req.body.country,
        timestamp: new Date(),
      });
    } else {
      return (response);
    }
  }).then((response) => {
    if (response.success) {
      res.json({success: true, data: {url: url}});
    } else {
      res.json(response);
    }
  }).catch((err) => {
    console.log(err);
    __logger.error('[url_fetch_error]=> '+err);
    next('[url_fetch_error]: '+err);
  });
});

app.get('/list', (req, res, next) => {
  appFunc.fetchAllCodeDetails().then((response) => {
    if (!response.success) {
      console.log(response.err);
    }
    res.json(response);
  }).catch((err) => {
    console.log(err);
    __logger.error('[list_error]=> '+err);
    next('[list_error]: '+err);
  });
});

app.get('/details', (req, res, next) => {
  appFunc.fetchCodeVisitDetails(req.query.code).then((response) => {
    if (!response.success) {
      console.log(response.err);
    }
    res.json(response);
  }).catch((err) => {
    console.log(err);
    __logger.error('[fetch_details_error]=> '+err);
    next('[fetch_details_error]'+err);
  });
});

app.post('/add', (req, res, next) => {
  appFunc.insertNewUrl({
    url: req.body.url,
    timestamp: new Date(),
  }).then((response) => {
    if (!response.success) {
      console.log(response.err);
    }
    res.json(response);
  }).catch((err )=> {
    console.log(err);
    __logger.error('[insert_new_error]=> '+err);
    next('[insert_new_error]: '+err);
  });
});

app.listen(__config.port);
console.log(`[app]: server listening at port ${__config.port}`);
