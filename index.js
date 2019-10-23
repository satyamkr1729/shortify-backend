const Express = require('express');
const bodyParser = require('body-parser');
const readConfig = require('jsonfile').readFileSync;
const appFunc = require('./appFunctions');

try {
  global.__config = readConfig('config.json');
} catch (e) {
  console.log('[error]: Server configuration not found');
}

const dbConnect = require('./dbModules/dbConnect');
global.__connect = dbConnect;

const app = new Express();

app.use(bodyParser.json());



app.get('/', (req, res) => {
  appFunc.fetchAllCodeDetails().then((response) => {
    res.json(response);
  });
});

app.listen(8081);
console.log('[app]: server listening at port 8081');
