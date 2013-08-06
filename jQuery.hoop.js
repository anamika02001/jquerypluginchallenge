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
		this.$maxSize = this.$ul.children().size();
		if(this.$options.rotation === "right"){
			this.$progressBarIterator = 2;
		}else{
			this.$progressBarIterator = 0;
		}
		this.init();
		this.initEventHandlers();
		
		this.$timer = this.playOnHover();
	//this.$timer = setInterval($.proxy(function(){this.slide(this.$options.rotation, this.$options.slide)}, this), this.$options.interval);
	};
	
	Hoop.defaults = {
		interval : 2000,
		rotation : "right"
	};
	
	Hoop.prototype = {
		init: function(){
			
			//this.$div.progressbar( "option", { disabled: true } );
			this.$div.append("<input type='image' class = 'previous' src='images/leftArrow.png' alt='Previous'/>");
			this.$div.append("<input type='image' class = 'next' src='images/rightArrow.png' alt='Next'/>");	
			this.$div.append("<input type='image' class = 'pause' src='images/pause.png' alt='Pause'/>");
			this.$div.append("<input type='image' class = 'play' src='images/play.png' alt='Play'/>");
			//this.$div.append("<input type='image' class = 'fullscreen' src='images/fullscreen.png' alt='Fullscreen'/>");
			this.$div.append("<div class='progressBar'></div>");

			
			$(this.$div.selector + " input.play").hide();
			this.initCss();
			$(this.$div.selector + " div.progressBar").progressbar();
			$(this.$div.selector + " div.progressBar").progressbar( "option", "max", this.$maxSize);
			//$(this.$div.selector + "div.progressBar").progressbar({"value":"70"});
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
				"position":"relative",
				"float": "left",
				"width": width,
				"height": height,
				"overflow": "hidden",
				"border" : "2px solid",

				
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
				"position": "absolute",
				//"text-align": "center",
				"left": "0px",
				"float": "left",
				"top": (height/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": "2",
			});	
			$(this.$div.selector + " input.next").css({
				"position": "absolute",
				//"text-align": "center",
				"float": "left",
				"top": height/2 + "px",
				"left": (width - buttonSize) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": "2",
			});		
			$(this.$div.selector + " input.pause").css({
				"position": "absolute",
				"float": "left",
				"top": height*4/5 + "px",
				"left": (width/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": "2",
			});	
			$(this.$div.selector + " input.play").css({
				"position": "absolute",
				"float": "left",
				"top": height*4/5 + "px",
				"left": (width/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": "2",
			});	
			$(this.$div.selector + " div.progressBar").css({
				"position": "absolute",
				"top": (height*0.89 ) + "px",
				"z-index": "3",
				"height": "5px",
				"width" : width + "px",
			});
		/*	$(this.$div.selector + " input.fullscreen").css({
				"position": "absolute",
				"top": (height - buttonSize) + "px",
				"left": (width - buttonSize) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": "2",
			});*/
			
		},
		
		initEventHandlers: function(){
			var scope = this;
			this.$timer = this.$div.hover($.proxy(this.pauseOnHover,this), $.proxy(this.playOnHover,this));
			
			$(window).resize($.proxy(this.initCss, scope));
			
			$(this.$div.selector + " input.next").click($.proxy(this.next, this));
			$(this.$div.selector + " input.previous").click($.proxy(this.previous, this));
			$(this.$div.selector + " input.fullscreen").click($.proxy(this.fullscreen, this));
			
			this.$timer = $(this.$div.selector + " input.pause").click($.proxy(this.pauseOnButton,this));
			this.$timer = $(this.$div.selector + " input.play").click($.proxy(this.playOnButton,this));
			
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
									
					
					this.$progressBarIterator -= 1;
					if(this.$progressBarIterator < 1){
						this.$progressBarIterator = this.$maxSize;
					}
					$(this.$li.selector + ":first").before($(this.$li.selector + ":last"));
					
				} else {
					//alert(this.$li.index());
					$(this.$li.selector + ":last").after($(this.$li.selector + ":first"));
					
					
					this.$progressBarIterator += 1;
					if(this.$progressBarIterator > this.$maxSize){
						this.$progressBarIterator = 1;
					}
				}
				this.$ul.css({"left": "0px", "margin-left":"auto", "margin-right":"auto"});
				$(this.$div.selector + " div.progressBar").progressbar({value: this.$progressBarIterator});
			}, this));
			if(callback != undefined){
				callback();
			}
		},
		
		pauseOnHover: function(){
			this.$hovered = true;
			this.$timer = clearInterval(this.$timer);
			if(this.$paused === true){
				$(this.$div.selector + " input.pause").css({"display": "none"});
				$(this.$div.selector + " input.play").css({"display": "block"});
			}else{
				$(this.$div.selector + " input.pause").css({"display": "block"});
				$(this.$div.selector + " input.play").css({"display": "none"});
			}
			$(this.$div.selector + " input.next").css({"display": "block"});
			$(this.$div.selector + " input.previous").css({"display": "block"});
			$(this.$div.selector + " div.progressBar").css({"display": "block"});
			return this.$timer;
		},
		
		playOnHover: function(){
			$(this.$div.selector + " input.next").css({"display": "none"});
			$(this.$div.selector + " input.previous").css({"display": "none"});
			$(this.$div.selector + " input.pause").css({"display": "none"});
			$(this.$div.selector + " input.play").css({"display": "none"});
			$(this.$div.selector + " div.progressBar").css({"display": "block"});
			if(this.$paused !== true)
			{
				this.$timer = setInterval($.proxy(function(){this.slide(this.$options.rotation, this.$options.slide)}, this), this.$options.interval);
				return this.$timer;
				this.$hovered = false;
			}
			return undefined;
		},
		
		pauseOnButton: function(){
				this.$paused = true;
				$(this.$div.selector + " input.pause").css({"display": "none"});
				$(this.$div.selector + " input.play").css({"display": "block"});
				this.$timer = clearInterval(this.$timer);
				return this.$timer;
		},
		
		playOnButton: function(){
		
				this.$paused = false;
				$(this.$div.selector + " input.play").css({"display": "none"});
				$(this.$div.selector + " input.pause").css({"display": "block"});
				if(this.$hovered !== true){
					this.$timer = setInterval($.proxy(function(){this.slide(this.$options.rotation, this.$options.slide)}, this), this.$options.interval);
				}
				return this.$timer;
		},
		
		next: function(){
			this.slide("left");
		},
		
		previous: function(){
			
			this.slide("right");
		},
		
		/*fullscreen: function(){
			this.$div.css({"width":"100%"});
		},*/
	};
}(jQuery));