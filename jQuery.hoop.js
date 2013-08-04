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
		this.initEventHandlers();
		
		this.$timer = this.play();

	};
	
	Hoop.defaults = {
		interval : 2000,
		rotation : "right"
	};
	
	Hoop.prototype = {
		init: function(){
			this.$div.append("<input type='image' class = 'previous' src='images/leftArrow.png' alt='Previous'/>");
			this.$div.append("<input type='image' class = 'next' src='images/rightArrow.png' alt='Next'/>");	
			this.initCss();
			
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
				width = "600";				
				height = "300";
				buttonSize = "30";
				
			} 

			if($(window).width() < 600){
				width = 0.949 * $(window).width();
				height = 0.594 * width;
				buttonSize = 0.05 * width;
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
				"width": width + "px",
				"height": height + "px",
			});


			
			$(this.$div.selector + " input.previous").css({
				"position": "relative",
				"top": -(height/2 + buttonSize/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": "2",
			});	
			$(this.$div.selector + " input.next").css({
				"position": "relative",
				"top": -(height/2 + buttonSize/2) + "px",
				"right": -(width - buttonSize*2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": "2",
			});			

		},
		
		initEventHandlers: function(){
			var scope = this;
			this.$div.hover($.proxy(this.pause, this), $.proxy(this.play, this));
			$(window).resize($.proxy(this.initCss, scope));
			$(this.$div.selector + " input.next").click($.proxy(this.next, this));
			$(this.$div.selector + " input.previous").click($.proxy(this.previous, this));
			
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
		},
		
		pause: function(){
			this.$timer = clearInterval(this.$timer);
			return this.$timer;
		},
		
		play: function(){
			this.$timer = setInterval($.proxy(function(){this.slide(this.$options.rotation, this.$options.slide)}, this), this.$options.interval);
			return this.$timer;
		},
		
		next: function(){
			this.slide("left");
		},
		
		previous: function(){
			this.slide("right");
		},
	};
}(jQuery));