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
		this.$width = 600;
		this.$height = 300;
		this.$index = 1;
		
		this.init();
		this.initCss();
		this.initEventHandlers();
		this.playOnHover();
	};
	
	Hoop.defaults = {
		interval : 2000,
		rotation : "right"
	};
	
	Hoop.prototype = {
		init: function(){
			this.$div.append("<input type='image' class = 'previous' src='images/leftArrow.png' alt='Previous'/>");
			this.$div.append("<input type='image' class = 'next' src='images/rightArrow.png' alt='Next'/>");	
			this.$div.append("<input type='image' class = 'pause' src='images/pause.png' alt='Pause'/>");
			this.$div.append("<input type='image' class = 'play' src='images/play.png' alt='Play'/>");
			//this.$div.append("<input type='image' class = 'fullscreen' src='images/fullscreen.png' alt='Fullscreen'/>");
			this.$div.append("<div class='progressBar'></div>");
			
			
			$(this.$div.selector + " input.play").hide();
			$(this.$div.selector + " div.progressBar").progressbar({
				max: this.$maxSize,
				value: this.$index
			});
		},
		
		initCss: function(){
			if($(window).width() >= 600){
				this.$width = "600";				
				this.$height = "300";
				buttonSize = "30";
			} 

			if($(window).width() < 600){
				this.$width = 0.949 * $(window).width();
				this.$height = 0.5 * this.$width;
				buttonSize = 0.05 * this.$width;
			}

			this.$div.css({
				"position":"relative",
				"width": this.$width + "px",
				"height": this.$height + "px",
				"overflow": "hidden",
				"border" : "2px solid",
			});
			this.$ul.css({
				"position" : "absolute",
				"list-style-type": "none",
				"width": "9999px",
				"float" : "left",
				"margin": "0px",
				"padding": "0px"
			});
			
			this.$li.css({
				"position":"relative",
				"float":"left",
				"width": this.$width,
				"height": this.$height,
				"text-align" : "center",
				"margin": "0px",
				"padding": "0px"
			});

			$(this.$div.selector + " input.previous").css({
				"position": "absolute",
				"left": "0px",
				"float": "left",
				"top": (this.$height/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": "2",
			});	
			
			$(this.$div.selector + " input.next").css({
				"position": "absolute",
				"float": "left",
				"top": this.$height/2 + "px",
				"left": (this.$width - buttonSize) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": "2",
			});	
				
			$(this.$div.selector + " input.pause").css({
				"position": "absolute",
				"float": "left",
				"top": this.$height*4/5 + "px",
				"left": (this.$width/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": "2",
			});	
			
			$(this.$div.selector + " input.play").css({
				"position": "absolute",
				"float": "left",
				"top": this.$height*4/5 + "px",
				"left": (this.$width/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": "2",
			});	
			
			$(this.$div.selector + " div.progressBar").css({
				"position": "absolute",
				"top": (this.$height*0.89 ) + "px",
				"z-index": "3",
				"height": "5px",
				"width" : this.$width + "px",
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
			this.$div.hover($.proxy(this.pauseOnHover,this), $.proxy(this.playOnHover,this));
			$(window).resize($.proxy(this.initCss, scope));
			$(this.$div.selector + " input.next").click($.proxy(this.next, this));
			$(this.$div.selector + " input.previous").click($.proxy(this.previous, this));
			$(this.$div.selector + " input.fullscreen").click($.proxy(this.fullscreen, this));
			$(this.$div.selector + " input.pause").click($.proxy(this.pauseOnButton,this));
			$(this.$div.selector + " input.play").click($.proxy(this.playOnButton,this));
		},
		
		slide: function(direction, callback){
			
			if(direction === "left"){
				this.$index++;
				if(this.$index === this.$maxSize + 1){
					this.$index = 1;
				}
				$(this.$div.selector + " div.progressBar").progressbar({value: this.$index});
				this.$ul.animate({"left": -((this.$index -1)* this.$width) + "px"},this.$interval > 1000 ? this.$interval - 1000 : this.$interval);
				
				
			}else{
				this.$index--;
				if(this.$index === 0){
					this.$index = this.$maxSize;
				}
				$(this.$div.selector + " div.progressBar").progressbar({value: this.$index});
				this.$ul.animate({"left": (-(this.$index -1) * this.$width) + "px"},this.$interval > 1000 ? this.$interval - 1000 : this.$interval);
			}
			var height = this.$li.children().eq(this.$index-1).height();
			var width = this.$li.children().eq(this.$index-1).width();
			//this.$li.children().eq(this.$index-1).css({});
			if(height > 300 || width > 600 ){
				if(width > height){
					this.$li.children().eq(this.$index-1).css({width: this.$width + "px", height: height*this.$width/width+ "px"});
				}else {
					this.$li.children().eq(this.$index-1).css({width: this.$height*width/height + "px", height: this.$height + "px"});
				}
				
			}
			
			if(callback != undefined){
				callback();
			}
		},
		
		pauseOnHover: function(){
			this.$hovered = true;
			this.$timer = clearInterval(this.$timer);
			if(this.$paused === true){
				$(this.$div.selector + " input.pause").hide();
				$(this.$div.selector + " input.play").show();
			}else{
				$(this.$div.selector + " input.pause").show();
				$(this.$div.selector + " input.play").hide();
			}
			$(this.$div.selector + " input.next").show();
			$(this.$div.selector + " input.previous").show();
			$(this.$div.selector + " div.progressBar").show();
			
		},
		
		playOnHover: function(){
			$(this.$div.selector + " input.next").hide();
			$(this.$div.selector + " input.previous").hide();
			$(this.$div.selector + " input.pause").hide();
			$(this.$div.selector + " input.play").hide();
			$(this.$div.selector + " div.progressBar").show();
			if(this.$paused !== true) {
				this.$timer = setInterval($.proxy(function(){this.slide(this.$options.rotation, this.$options.slide)}, this), this.$options.interval);
				this.$hovered = false;
			}
			return undefined;
		},
		
		pauseOnButton: function(){
			this.$paused = true;
			$(this.$div.selector + " input.pause").hide();
			$(this.$div.selector + " input.play").show();
			this.$timer = clearInterval(this.$timer);
		},
		
		playOnButton: function(){
			this.$paused = false;
			$(this.$div.selector + " input.play").hide();
			$(this.$div.selector + " input.pause").show();
			if(this.$hovered !== true){
				this.$timer = setInterval($.proxy(function(){this.slide(this.$options.rotation, this.$options.slide)}, this), this.$options.interval);
			}
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