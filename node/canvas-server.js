(function(){

	var canvasServer = function(){
		this.server = require("http").createServer();
		this.clients = [];
		this.ctx = new (require("./ctx.js").Ctx)();

		this.ws = new (require("websocket").server)({ httpServer : this.server, autoAcceptConnections : true });

		var parent = this;
		this.ws.on("connect", function (conn) {
				console.log();

				conn.nickname = conn.remoteAddress;
				conn.on(
						"message", 
						function(data){
							console.log('client '+ this.nickname +' says: ' + JSON.stringify(data, null, 3));

							var packet = JSON.parse(data.utf8Data);
							if(packet.type === "ask"){
								conn.sendUTF(JSON.stringify( { type: 'full', state: parent.ctx.state} ));
							}

						});

				conn.on(
						"close", 
						function(){
							var index = parent.clients.indexOf(this);

							if (index > -1) {
								parent.clients.splice(index, 1);
							}

							console.log('client left: ' + this.nickname);
						});

				// add connection the client list
				parent.clients.push(conn);
		
				console.log('new client: ' + conn.nickname);
			});

		return this;
	};

	canvasServer.prototype.broadcast = function (data){
		this.clients.forEach(function(c){ c.sendUTF(data); });
	};

	canvasServer.prototype.listen = function( port ){
		this.server.listen( port );
	};

	exports.canvasServer = canvasServer;	
})();
