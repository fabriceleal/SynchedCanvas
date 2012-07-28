# SynchedCanvas

A simple proof of concept using node and html5 (canvas + WebSockets)

## Usage:

On the client side:

* Add the client.js to the html (it's in the html/ dir)

* To connect the canvas to the server simply do:

```javascript
	setup( document.getElementById('canvas_elem') )
```

On the server side:

```javascript

	var server = new (require("./node/canvas-server.js").canvasServer)();

	// The port number is hardcoded in the client.js
	server.listen(9876);
```

... and now you are ready to draw. Call the functions in the server.ctx object
like this:

```javascript
	server.ctx.setFillStyle('red');
	server.ctx.fillRect(30, 30, 50, 50);
```

or like this:

```javascript
	server.ctx.setFillStyle('red').fillRect(30, 30, 50, 50);
```

If you wish to buffer changes in the server, call:
```javascript
	server.ctx.haltNotifications();
```

to release all changes to the clients, call:
```javascript
	server.ctx.notify();
```

so your example becomes:
```javascript
	server.ctx.haltNotifications().
			setFillStyle('red').
			fillRect(30, 30, 50, 50).
			notify();
```

