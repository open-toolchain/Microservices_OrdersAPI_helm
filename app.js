/*globals cloudantService:true */
/*eslint-env node */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');

console.log("PROCESS.ENV --------");
console.log(process.env);

//Retrieve Cloudant credentials from env variables
cloudantService = JSON.parse(process.env.CLOUDANT_SERVICE);

//Setup middleware.
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'www')));

//REST HTTP Methods
var orders = require('./routes/orders');
app.get('/rest/orders', orders.list);
app.get('/rest/orders/:id', orders.find);
app.post('/rest/orders', orders.create);

app.listen(process.env.WEB_PORT);
console.log('App started on ' + process.env.WEB_PORT);

