#!/usr/bin/node

var server = new (require("./node/canvas-server.js").canvasServer)();

server.listen(9876);

var to_red = function(){
	console.log('to_red()');
	server.ctx.haltNotifications().setFillStyle('red').fillRect(30, 30, 50, 50).
				/*setFont('italic 15px Arial, sans-serif').setFillStyle('green').fillText("Hello World!", 100, 50).*/notify();
	//--
	setTimeout(to_green, 1000);
};

var to_green = function(){
	console.log('to_green()');
	server.ctx.haltNotifications().setFillStyle('green').fillRect(30, 30, 50, 50).
				/*setFont('italic 15px Arial, sans-serif').setFillStyle('red').fillText("Hello World!", 100, 50).*/notify();
	//--
	setTimeout(to_red, 1000);
};

to_red();

