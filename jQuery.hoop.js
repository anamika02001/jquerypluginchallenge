(function($){
	$.fn.hoop = function(options){
		return new Hoop($(this), $.extend({}, Hoop.defaults, options));
	};
	
	$.fn.hoop.Constructor = Hoop;
	
	var Hoop = function(element, options){
		this.$div = $(element);
		this.$ul = $(this.$div.selector + " ul");
		this.$li = $(this.$div.selector + " ul li");
		this.$options = options;
		this.init();
		this.$timer = setInterval($.proxy(function(){this.slide(options.rotation, options.slide)}, this), this.$options.interval);
	};
	
	Hoop.defaults = {
		interval : 2000,
		rotation : "right"
	};
	
	Hoop.prototype = {
		init: function(){
			this.initCss();
			var scope = this;
			$(window).resize($.proxy(this.initCss, scope));
			if(this.$options.rotation === "left"){
				$(this.$li.selector + ":first").before($(this.$li.selector + ":last"));
			} else{
				$(this.$li.selector + ":last").after($(this.$li.selector + ":first"));
			}
			this.slide(this.$options.rotation, this.$options.slide);
		},
		
		initCss: function(){
			var width, height;
			if($(window).width() >= 600){
				width = "600px";				
				height = "300px";
			} 

			if($(window).width() < 600){
				width = 0.949 * $(window).width();
				height = 0.594 * width;
			}

			this.$div.css({
				"float": "left",
				"width": width,
				"overflow": "hidden"
			});
			this.$ul.css({
				"left": "0px",
				"position": "relative",
				"list-style-type": "none",
				"width": "9999px",
				"margin": "0px",
				"padding": "0px"
			});
			this.$li.css({
				"padding": "0px",
				"margin": "0px",
				"float": "left",
				"background": "transparent",
				"width": width,
				"height": height,
			});

		},
		
		slide: function(direction, callback){
			var width = this.$li.outerWidth();
			if(direction === "right"){
				var left = parseInt(this.$ul.css("left")) + width;
			} else {
				var left = parseInt(this.$ul.css("left")) - width;
			}
			$(this.$ul.selector + ":not(:animated)").animate({"left": left}, 
			this.$interval > 1000 ? this.$interval - 1000 : this.$interval, 
			$.proxy(function(){
				if(direction === "right"){
					$(this.$li.selector + ":first").before($(this.$li.selector + ":last"));
				} else {
					$(this.$li.selector + ":last").after($(this.$li.selector + ":first"));
				}
				this.$ul.css({"left": "0px"});
			}, this));
			if(callback != undefined){
				callback();
			}
		}
		
	};
}(jQuery));