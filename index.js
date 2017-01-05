const cors=require('cors');
var express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
var mysql      = require('mysql');
var mysqlqqww      1;

'use strict';

const server = express().use(cors())
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
              console.log("connected "+data.name);
          console.log(data);
          clients[data.id] = {
            "socket": socket.id
          };

          console.log(clients);
        });

        socket.on('message', function(data){
          console.log("data");
          console.log(data);
          console.log("Sending: " + data.message + " to " + data.receiver);
          if (clients[data.receiver]){
            io.sockets.connected[clients[data.receiver].socket].emit("chat", {message:data.message,senderid:data.senderid,sendername:data.sendername});
            io.sockets.connected[clients[data.receiver].socket].emit("refresh", {message:data.message,senderid:data.senderid,sendername:data.sendername});
            io.sockets.connected[clients[data.receiver].socket].emit("refresh1", {message:data.message,senderid:data.senderid,sendername:data.sendername});
              // mysql_(data,1);
          } else {
            console.log("User not logged in: " + data.receiver);
            console.log("saving messages to db");
            // mysql_(data,0);
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


      function mysql_(data,status){
        // data=12;
        console.log(data);
        connection_.query("INSERT INTO `chat`(`id`, `sendername`, `receiver`, `message`, `semderid`, `status`) VALUES ('"+12+"','"+data.sendername+"','"+data.receiver+"','"+data.message+"','"+data.senderid+"','"+status+"')",function(err, rows, fields) {

      if (err) throw err;
      console.log("SAVING MESSAGE FROM "   +data.sendername);
      // console.log('The solution is: ', rows[0].id);
      });
      }

      function update_(x){
      var d= {};

      connection_.query("SELECT * FROM `chat` WHERE `receiver` = "+x+" AND `status` = 0",function(err, rows, fields) {
        console.log("updating messages of  "   +x);

       io.to(getsock(x).id).emit('update',rows);
      });
      console.log(this.d);
      //  return d[0];
      }
