const Express = require('express');
const bodyParser = require('body-parser');
const readConfig = require('jsonfile').readFileSync;
const dbConnect = require('./dbConnect');

try {
  global.__config = readConfig('config.json');
} catch (e) {
  console.log('[error]: Server configuration not found');
}
global.__connect = dbConnect;

const app = new Express();

app.use(bodyParser.json());
