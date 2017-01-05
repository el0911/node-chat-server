const cors=require('cors');

const socketIO = require('socket.io');

const path = require('path');
var express = require('express');
const PORT = process.env.PORT || 3100;
const INDEX = path.join(__dirname, 'index.html');

var FCM = require('fcm-push');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
// var url = 'mongodb://127.0.0.1:27017/nemo';
var url = 'mongodb://nemo:nemo@ds145868.mlab.com:45868/nemo_1';

var serverKey = 'AAAAHx_cRY4:APA91bF7YkfrOYdlLxfdqkXQYuPHbPIl9atoIUQiADJerkFTeyh0bvy8Rle5MiI_hH4b6AG3ukLillmqqhWIxZETw-BYib7UlSONeO5C-39PFrVWrBkI-huFMFGisZnAQZT2xfjzxC8eo5ankUDEj2ac4wHC6QYaYQ';
var fcm = new FCM(serverKey);
var mysql      = require('mysql');
var d=1;
'use strict';

const server = express().use(cors()).
get('/register/:userId', function (req, res) {


// clients[req.params.userId].push=req.params.pushid;////just replace it if it was their or put a new one if it wasnt
  // console.log(d);
  console.log(req.params);
  d=d + 1;
})
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
