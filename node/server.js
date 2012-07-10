#!/usr/bin/node

var server = new (require("./canvas-server.js").canvasServer)();

server.listen(9876);

server.ctx.setFillStyle('red').fillRect(30, 30, 50, 50);

/*

var	wsServer = require("websocket").server,
		wsClient = require("websocket").client,
		wsFrame 	= require("websocket").frame,
		wsRouter = require("websocket").router;

// Setup ws server
var server = require("http").createServer();
ws = new wsServer({ httpServer : server, autoAcceptConnections : true });

// Start ws server
server.listen(9876);

var clients = [];

var Ctx = require("./ctx.js").Ctx;

// Draw into context

var ctx = new Ctx();
ctx.setFillStyle('red').fillRect(30, 30, 50, 50);


//	Send data to all registered clients
var broadcast = function (data){
	clients.forEach(function(c){ c.sendUTF(data); });
};

ws.on("connect", function (conn) {
		console.log(conn);
		// set the initial nickname to the client IP
		conn.nickname = conn.remoteAddress;
		conn.on(
				"message", 
				function(data){
					console.log('client '+ this.nickname +' says: ' + JSON.stringify(data, null, 3));

					var packet = JSON.parse(data.utf8Data);
					if(packet.type === "ask"){
						conn.sendUTF(JSON.stringify( { type: 'full', state: ctx.state} ));
					}

				});

		conn.on(
				"close", 
				function(){
					var index = clients.indexOf(this);

					if (index > -1) {
						clients.splice(index, 1);
					}

					console.log('client left: ' + this.nickname);
				});

		// add connection the client list
		clients.push(conn);
		
		console.log('new client: ' + conn.nickname);
	});
*/
