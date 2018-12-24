/**
@author: dhananjay patil
@version: 1.0
@date: 06/05/2017
@Description: Hyperledger Fabric Blockchain sample client
**/
//this is the start of the application 
//from here the blockchain enviornment setup would start and our node js port for webservice would also start running

'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const loggerpac = require('morgan');
const router = express.Router();
const request = require('request');

var logger;
var Promise = require('bluebird');
var log4js = require('log4js');
// var config = require('config');


module.exports = router;
app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT || 3008;
app.listen(port);

app.use(bodyParser.json());
app.use(loggerpac('dev'));

require('./routes')(router);
app.use('/', router);

app.use(bodyParser.urlencoded({ extended: true }));
console.log(`App Runs on ${port}`);

