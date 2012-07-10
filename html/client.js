function setup( canvas ){
	var ws = new WebSocket("ws://127.0.0.1:9876/");
	var ctx = canvas.getContext('2d');	


	var state = undefined;

	var __privateSync = function(){

		ws.send(JSON.stringify({ type:'ask' }));

	};

	var ret = {
		sync : function(){ return __privateSync(); }
	};

	// Listeners
	
	ws.addEventListener("message", function(e) {
		console.log(e.data);

		var functions = {
			setFillStyle : function(e){ ctx.fillStyle = e; },
			// Calling ctx.fillRect directly through apply throws error. WHY?
			fillRect		 : function(a, b, c, d){ ctx.fillRect(a, b, c, d); } 
		};

		JSON.parse(e.data).state.pipeline.forEach(function(a){ functions[a.action.fun].apply(null, a.action.args)})
		
	}, false);

	ws.addEventListener("open", function () {
		console.log('connected!');

		ret.sync();
	});

	ws.addEventListener("close", function() {
		console.log('closed!');
	}, false);

	return ret;
};
