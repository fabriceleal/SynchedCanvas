function setup( canvas ){
	var ws = new WebSocket("ws://127.0.0.1:9876/");
	var ctx = canvas.getContext('2d');	


	var last_pipeline_id = undefined;
	var last_action_id = undefined;
	var last_state = undefined;

	var __privateSync = function(){
		if(last_state === undefined){
			ws.send(JSON.stringify({ type: 'ask' }));
		} else {
			ws.send(JSON.stringify({ type: 'ask_diff', current:{ pipeline_id: last_pipeline_id, action_id: last_action_id } }));
		}
	};

	var ret = {
		sync : function(){ return __privateSync(); }
	};

	// Setters
	var __fields = [
		'fillStyle',
		'font',
		'shadowBlur',
		'shadowColor',
		'shadowOffsetX',
		'shadowOffsetY',
		'strokeStyle',
		'textAlign',
		'textBaseline'
	];

	var __functions = [
		'arc',
		'arcTo',
		'beginPath',
		'bezierCurveTo',
		'clearRect',
		'clearShadow',
		'clip',
		'closePath',
		'createImageData',
		'createLinearGradient',
		'createPattern',
		'createRadialGradient',
		'drawImage',
		'drawImageFromRect',
		'fill',
		'fillRect',
		'fillText',
		'getImageData',
		'isPointInPath',
		'lineTo',
		'measureText',
		'moveTo',
		'putImageData',
		'quadraticCurveTo',
		'rect',
		'restore',
		'rotate',
		'save',
		'scale',
		'setAlpha',
		'setCompositeOperation',
		'setFillColor',
		'setLineCap',
		'setLineJoin',
		'setLineWidth',
		'setMiterLimit',
		'setShadow',
		'setStrokeColor',
		'setTransform',
		'stroke',
		'strokeRect',
		'strokeText',
		'transform',
		'translate'
	];

	var functions = {};

	__fields.forEach(function(__field){
		functions['set' + __field[0].toUpperCase() + __field.slice(1)] = eval('(function(){ return function(){ ctx.' + __field + ' = Array.prototype.slice.call(arguments)[0]; }})()');
	});

	__functions.forEach(function(__function){
		functions[__function] = eval('(function(){ return ctx.' + __function + ';})()');
	});

	// Listeners
	
	ws.addEventListener("message", function(e) {
		//console.log(e.data);

		var response = JSON.parse(e.data);
		switch (response.type){
			case "full":
				response.state.pipeline.forEach(
						function(a){
							functions[a.action.fun].apply(ctx, a.action.args);
							last_action_id = a.action_id;
						});
				//---
				last_pipeline_id = response.state.pipeline_id;
				last_state = response.state;

				break;
			case "diff":
				
				break;
			case "server_changed":
				__privateSync();
				break;
		}
		
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
