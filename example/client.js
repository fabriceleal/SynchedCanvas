function setup( canvas ){
	var ws = new WebSocket("ws://127.0.0.1:9876/");
	var ctx = canvas.getContext('2d');	

	

	ws.addEventListener("open", function () {
		console.log('connected!');
	});

	var state = undefined;

	var __privateSync = function(){

		ws.send(JSON.stringify({ type:'ask' }));

	};

	ws.addEventListener("message", function(e) {
		console.log(e.data);

		var functions = {
			setFillStyle : function(e){ ctx.fillStyle = e; },
			fillRect		 : function(a, b, c, d){ ctx.fillRect(a, b, c, d); }
		};

		JSON.parse(e.data).state.pipeline.forEach(function(a){ functions[a.action.fun].apply(null, a.action.args)})
		
	}, false);

	ws.addEventListener("close", function() {
		console.log('closed!');
	}, false);

	return {
		sync : function(){ return __privateSync(); }
	};
};
