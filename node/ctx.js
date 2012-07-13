(function(){
	var EventEmitter = require('events').EventEmitter;

	var Ctx = function(){
		this.current_id = 0;
		this.state = {};
		this.notifyWhenChanged = true;
		this.changed = false;
		this.reset();
	};

	Ctx.prototype = new EventEmitter();
	Ctx.prototype.constructor = Ctx;

	// Notifications mechanism

	Ctx.prototype.haltNotifications = function(){
		this.notifyWhenChanged = false;

		return this;
	};

	Ctx.prototype.onChanged = function(){
		if(this.notifyWhenChanged){
			this.emit("changed", this);
		} else {
			this.changed = true;
		}
	};

	Ctx.prototype.notify = function(){
		if(this.changed){
			this.emit("changed", this);
			this.changed = false;
		}

		this.notifyWhenChanged = true;

		return this;
	};

	// ---

	Ctx.prototype.reset = function(){
		this.current_id++;
	
		this.state.pipeline_id = this.current_id;
		this.state.pipeline = [];
		this.state.current_action_id = undefined;
	};

	var functions = ['setFillStyle', 'fillRect', 'setFont', 'fillText'];

	functions.forEach(function(f){
		eval(
			'Ctx.prototype.' + f + ' = function(){' + 
				'this.state.current_action_id = ++this.current_id;' +
				'this.state.pipeline.push({ action_id: this.state.current_action_id , action: { fun:"' + f + '", args: Array.prototype.slice.call(arguments) }}); '+
				'this.onChanged(); ' + 
				'return this;' +
			'}');
	});

	/*Ctx.prototype.setFillStyle = function(color){
		this.state.pipeline.push({ action_id: ++this.current_id , action: { fun:'setFillStyle', args:[ color ] }});

		this.onChanged();

		return this;
	};

	Ctx.prototype.fillRect = function(a, b, c, d){
		this.state.pipeline.push({ action_id: ++this.current_id , action: { fun:'fillRect', args: [a, b, c, d] }});
		
		this.onChanged();

		return this;
	};*/

	exports.Ctx = Ctx;
})();
