(function(){

	var message_handler = {

	};

	var canvasServer = function(){
		this.server = require("http").createServer();
		this.clients = [];
		this.ctx = new (require("./ctx.js").Ctx)();

		this.ws = new (require("websocket").server)({ httpServer : this.server, autoAcceptConnections : true });

		var parent = this;

		// Broadcast to all clients that the context has changed. Clients must issue a request for all the drawing 
		// calls needed to be done to synchronize the canvas'es
		this.ctx.on("changed", function(ctx){
			parent.broadcast({ type: "server_changed" });			
		})

		this.ws.on("connect", function (conn) {

				console.log('client connected! ' + conn.remoteAddress);

				conn.nickname = conn.remoteAddress;
				conn.on(
						"message", 
						function(data){
							console.log('client '+ this.nickname +' says: ' + JSON.stringify(data, null, 3));

							var packet = JSON.parse(data.utf8Data);
							if(packet.type === "ask"){
								// Send full state
								conn.sendUTF(JSON.stringify( { type: 'full', state: parent.ctx.state } ));
							}
							if( packet.type === "ask_diff" ){

								var clientPipelineId = packet.current.pipeline_id;
								var clientActionId 	= packet.current.action_id;
								
								if( clientPipelineId !== parent.ctx.state.pipeline_id ){
									conn.sendUTF(JSON.stringify( { type: 'full', state: parent.ctx.state } ));
								}else{
									if( clientActionId !== parent.ctx.state.current_action_id ){

										conn.sendUTF(JSON.stringify(
												{
													type: 'diff',
													state: parent.ctx.state.pipeline.filter(
															function(a){
																return a.action_id > clientActionId && a.action_id <= parent.ctx.state.current_action_id; 
															})
												}));
										//--

									}
								}
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
		this.clients.forEach(function(c){ c.sendUTF( JSON.stringify(data) ); });
	};

	canvasServer.prototype.listen = function( port ){
		this.server.listen( port );
	};

	exports.canvasServer = canvasServer;	
})();
