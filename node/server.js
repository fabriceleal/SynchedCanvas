#!/usr/bin/node

var	wsServer = require("websocket").server/*,
		wsClient = require("websocket").client,
		wsFrame 	= require("websocket").frame,
		wsRouter = require("websocket").router*/;


var server = require("http").createServer();

ws = new wsServer({ httpServer : server, autoAcceptConnections : true });

server.listen(9876);

var clients = [];

var Ctx = function(){

};

Ctx.prototype.setFillStyle = function(color){
	state.pipeline.push({ action: { fun:'setFillStyle', args:[ color ] }});

	return this;
};

Ctx.prototype.fillRect = function(a, b, c, d){
	state.pipeline.push({ action: { fun:'fillRect', args: [a, b, c, d] }});

	return this;
};

var state = {
	pipeline_id : 1,
	pipeline : []
};

var ctx = new Ctx();
ctx.setFillStyle('red').fillRect(30, 30, 50, 50);

/*
	Send data to all registered clients
*/
var broadcast = function (data){
	clients.forEach(function(c){ c.sendUTF(data); });
};

ws.on("connect", function (conn) {

		// set the initial nickname to the client IP
		conn.nickname = conn.remoteAddress;
		conn.on("message", 
				function(data){
					console.log('client '+ this.nickname +' says: ' + JSON.stringify(data, null, 3));

					var packet = JSON.parse(data.utf8Data);
					if(packet.type === "ask")
						conn.sendUTF(JSON.stringify( { type: 'full', state: state} ));
				
				});

		conn.on("close", 
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

