const cors=require('cors');

const socketIO = require('socket.io');

const path = require('path');
var express = require('express');
const PORT = process.env.PORT || 3000;
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


clients[req.params.userId].push=req.params.pushid;////just replace it if it was their or put a new one if it wasnt
  console.log(d);
  console.log(req.params);
  d=d + 1;
})
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);
var connection_ = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'chat_db'
});

// connection_.connect();
// testing
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server");
//   });


console.log("Listening on port " + PORT);


///api routes

//f it not doing this part ever

// app.get("/index", function(req, res){
//     res.json({name:"It works!"});
//     console.log("sending api");
// });

      var clients = {};



      io.sockets.on('connection', function (socket) {

        socket.on('user', function(data){
          clients[data.id] = {
            "socket": socket.id
          };

        console.log("connected "+data.name);
          ///search if their is a user like him or her
          MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to server");

            authuser(db,data.id, function(x,y) {/////y is the data am user looking for
              console.log(x);
              if(x.length<1){
                console.log("add");
                insertuser(db,y,function(){
                    db.close();
                })
              }
              else {
                console.log("update");
                updateuser(db,data,function(){
                  db.close()
                });
              }

          });

          });

          console.log(clients);
          console.log("updating");
          update_(data.id);
        });



        socket.on('message', function(data){
          if(!checkifregistered(data.senderid)){
            console.log("not registered");
            // io.sockets.connected[clients[data.receiver].socket].emit("register", {data:"register"});
          }
          console.log("data");
          console.log(data);
          console.log("Sending: " + data.message + " to " + data.receiver);
          if (clients[data.receiver]){
            io.sockets.connected[clients[data.receiver].socket].emit("chat", {message:data.message,senderid:data.senderid,sendername:data.sendername});
            io.sockets.connected[clients[data.receiver].socket].emit("refresh",{data:"refresh"});
            io.sockets.connected[clients[data.receiver].socket].emit("refresh1", {data:"refresh"});
            MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            console.log("Connected successfully to server");

            authuser(db,data.receiver,function(x,y){
                db.close();
              if(x.length>0){
                send(x[0],data);///send the first shit
              }
            });

          });
          console.log("socks");
          console.log(clients[data.receiver].socket);
          // io.emit("chat", {message:data.message,senderid:data.senderid,sendername:data.sendername});

              // mysql_(data,1);
          } else {
            console.log("User not logged in: " + data.receiver);
            console.log("saving messages to db");
            // mysql_(data,0);
            ///push notification
            MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            console.log("Connected successfully to server");

            authuser(db,data.receiver,function(x,y){
                db.close();
              if(x.length>0){
                send(x[0],data);///send the first shit
              }
            });

          });
          }
        });

        //Removing the socket on disconnect
        socket.on('disconnect', function() {
        	for(var name in clients) {
        		if(clients[name].socket === socket.id) {
              console.log("deleted");
              console.log(clients[name]);
        			delete clients[name];
        			break;
        		}
        	}
        })

      });

      function checkifregistered(x) {
        var d=false;
        for (var i = 0; i < clients.length; i++) {
        if (clients[name]+""===x+"") {
          d=true;
          i=clients.length;///ending the loop
        }
        }
        return d;
      }

      function mysql_(data,status){
        // data=12;
        console.log(data);
        connection_.query("INSERT INTO `messages`( `sendername`, `receiver`, `message`, `senderid`, `status`) VALUES ('"+data.sendername+"','"+data.receiver+"','"+data.message+"','"+data.senderid+"','"+status+"')",function(err, rows, fields) {

      if (err) throw err;
      console.log("SAVING MESSAGE FROM "   +data.senderid);
      // console.log('The solution is: ', rows[0].id);
      });
      }

      function update_(x){
      var d= {};

      connection_.query("SELECT * FROM `messages` WHERE `receiver` = "+x+" AND `status` = 0",function(err, rows, fields) {
        console.log("updating messages of  "   +x);
        io.sockets.connected[clients[x].socket].emit("update",rows);
  });



  /////set messages to seen
  connection_.query("UPDATE * `messages` SET `status` = 1 WHERE  `receiver` = "+x+" AND `status` = 0",function(err, rows, fields) {
    console.log("seen messages of  "   +x);
    });


      console.log(this.d);
      //  return d[0];
      }




      function send(x,y){
        var message = {
          to:x.push, // required fill with device token or topics
          // collapse_key: 'your_collapse_key',
          data: {
              // your_custom_data_key: 'your_custom_data_value'
          },
          notification: {
              title: 'message from '+y.sendername,
              body: y.message+' '
          }
      };

      //callback style
      fcm.send(message)
          .then(function(response){
              console.log("Successfully sent with response: ", response);
          })
          .catch(function(err){
              console.log("Something has gone wrong!");
              console.error(err);
          })
      }


      var insertuser = function(db,y ,callback) {
        // Get the documents collection
        var collection = db.collection('documents');
        // Insert some documents
        collection.insertMany([
        y
        ], function(err, result) {
          // assert.equal(err, null);
          // assert.equal(1, result.result.n);
          // assert.equal(1, result.ops.length);
          console.log("Inserted 3 documents into the collection");
          callback(result);
        });
      }

      var authuser = function(db,x,callback) {
        // Get the documents collection
        console.log(x);
        var collection = db.collection('documents');
        // Find some documents
        collection.find({id:x}).toArray(function(err, docs) {
          // assert.equal(err, null);
          callback(docs,x);
        });
      }


      var updateuser = function(db,x, callback) {
        // Get the documents collection
        var collection = db.collection('documents');
        // Update document where a is 2, set b equal to 1
        collection.updateOne({ id : x.id }
          , { $set: { socket : x.socket,push:x.push } }, function(err, result) {
          // assert.equal(err, null);
          // assert.equal(1, result.result.n);
          console.log("Updated the user Socket now "+x.socket +"and push now"+" "+x.push);
          callback(result);
        });
      }


      var removeDocument = function(db, callback) {
        // Get the documents collection
        var collection = db.collection('documents');
        // Insert some documents
        collection.deleteOne({ a : 3 }, function(err, result) {
          // assert.equal(err, null);
          // assert.equal(1, result.result.n);
          console.log("Removed the document with the field a equal to 3");
          callback(result);
        });
      }
