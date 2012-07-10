(function(){
	var Ctx = function(){
		this.current_id = 0;
		this.state = {};
		this.reset();
	};

	Ctx.prototype.reset = function(){
		this.current_id++;
	
		this.state.pipeline_id = this.current_id;
		this.state.pipeline = [];
	};

	Ctx.prototype.setFillStyle = function(color){
		this.state.pipeline.push({ action_id: ++this.current_id , action: { fun:'setFillStyle', args:[ color ] }});

		return this;
	};

	Ctx.prototype.fillRect = function(a, b, c, d){
		this.state.pipeline.push({ action_id: ++this.current_id , action: { fun:'fillRect', args: [a, b, c, d] }});

		return this;
	};

	exports.Ctx = Ctx;
})();
