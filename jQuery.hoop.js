(function($){
	$.fn.hoop = function(options){
			return new Hoop($(this), $.extend({}, Hoop.defaults, options));
	};
	
	$.fn.hoop.Constructor = Hoop;
	
	var Hoop = function(element, options){
		this.$div = $(element);
		this.$ul = $(this.$div.selector + " ul");
		this.$li = $(this.$div.selector + " ul li");
		//this.flickr(this);
		this.$options = options;
		this.$maxSize = this.$ul.children().size();
		this.$width = 600;
		this.$height = 300;
		this.$index = 1;
		this.$isFullscreen = false;
		this.init();
		this.initEventHandlers();
		this.$timer = this.playOnHover();

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
			this.$div.append("<input type='image' class = 'fullscreen' src='images/fullscreen.png' alt='Fullscreen'/>");
			this.$div.append("<input type='image' class = 'fullscreenExit' src='images/fullscreenExit.png' alt='FullscreenExit'/>");
			this.$div.append("<div class='progressBar'></div>");
			
			
			$(this.$div.selector + " input.play").hide();
			$(this.$div.selector + " div.progressBar").progressbar({
				max: this.$maxSize,
				value: this.$index
			});
			this.initCss();
			
		},
		
		initCss: function(){
		

			if($(window).width() >= 600)
			{	
				this.$width = "600";				
				this.$height = "300";
				
			}
			if($(window).width() < 600){
				this.$width = 0.949 * $(window).width();
				this.$height = 0.5 * this.$width;
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
				"padding": "0px",
				"z-index" : "1",
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

			this.setButtonProperties(2);
			
		},
		
		setButtonProperties: function(zIndex){
			buttonSize = 0.05 * this.$width;
			$(this.$div.selector + " input.previous").css({
				"position": "absolute",
				"left": "0px",
				"float": "left",
				"top": (this.$height/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": zIndex,
			});	
			
			$(this.$div.selector + " input.next").css({
				"position": "absolute",
				"float": "left",
				"top": this.$height/2 + "px",
				"left": (this.$width - buttonSize) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": zIndex,
			});	
				
			$(this.$div.selector + " input.pause").css({
				"position": "absolute",
				"float": "left",
				"top": this.$height*0.75 + "px",
				"left": (this.$width/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": zIndex,
			});	
			
			$(this.$div.selector + " input.play").css({
				"position": "absolute",
				"float": "left",
				"top": this.$height*0.75 + "px",
				"left": (this.$width/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": zIndex,
			});	
			
			$(this.$div.selector + " div.progressBar").css({
				"position": "absolute",
				"top": (this.$height*0.87 ) + "px",
				"z-index": zIndex,
				"height": "5px",
				"width" : this.$width + "px",
			});
			
			$(this.$div.selector + " input.fullscreen").css({
				"position": "absolute",
				"top": (this.$height - buttonSize) + "px",
				"left": (this.$width - buttonSize) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": zIndex,
			});
			$(this.$div.selector + " input.fullscreenExit").css({
				"position": "absolute",
				"top": (this.$height - buttonSize) + "px",
				"left": (this.$width - buttonSize) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": zIndex,
			});
			
		},
		
		
		initEventHandlers: function(){
			var scope = this;
			this.$div.hover($.proxy(this.pauseOnHover,this), $.proxy(this.playOnHover,this));
			$(window).resize($.proxy(this.initCss, scope));
			$(window).load($.proxy(function(){
			this.getOriginalSize();
			this.setChildProperties();
			}, scope));
			$(this.$div.selector + " input.next").click($.proxy(this.next, this));
			$(this.$div.selector + " input.previous").click($.proxy(this.previous, this));
			$(this.$div.selector + " input.fullscreen").click($.proxy(this.fullscreen, this));
			$(this.$div.selector + " input.pause").click($.proxy(this.pauseOnButton,this));
			$(this.$div.selector + " input.play").click($.proxy(this.playOnButton,this));
			$(this.$div.selector + " input.fullscreen").click($.proxy(this.fullscreen,this));
			$(this.$div.selector + " input.fullscreenExit").click($.proxy(this.fullscreenExit,this));
		},
		getOriginalSize : function(){
			for(i = 0; i< this.$maxSize; i++){
				var child = this.$li.children().eq(i);
				child.attr("naturalHeight",child.height());
				child.attr("naturalWidth",child.width());
			}
			
		},
		
		setChildProperties: function(){
			for(i = 0; i< this.$maxSize; i++){
				this.setCssForChild(i);
			}
		},
		setCssForChild : function(child){
			var height = parseInt(this.$li.children().eq(child).attr("naturalHeight"),10);
			var width = parseInt(this.$li.children().eq(child).attr("naturalWidth"),10);
			if(height > this.$height || width > this.$width ){
				if(width > height){
					height = height*this.$width/width;
					width = this.$width;
					
				}else {
					width = this.$height*width/height;
					height =  this.$height;
					
				}
			}
			var topMargin = ((this.$height > height)?((this.$height - height)/2): 0);
			this.$li.children().eq(child).css({width: width + "px", height: height + "px", "margin-top" : topMargin + "px" });
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
			this.setCssForChild(this.$index - 1);
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
			if(this.$isFullscreen === true){
				$(this.$div.selector + " input.fullscreen").hide();
				$(this.$div.selector + " input.fullscreenExit").show();
			}else{
				$(this.$div.selector + " input.fullscreen").show();
				$(this.$div.selector + " input.fullscreenExit").hide();
			}
			$(this.$div.selector + " input.next").show();
			$(this.$div.selector + " input.previous").show();
			$(this.$div.selector + " div.progressBar").show();
			return this.$timer;
			
		},
		
		playOnHover: function(){
			$(this.$div.selector + " input.next").hide();
			$(this.$div.selector + " input.previous").hide();
			$(this.$div.selector + " input.pause").hide();
			$(this.$div.selector + " input.play").hide();
			$(this.$div.selector + " div.progressBar").show();
			$(this.$div.selector + " input.fullscreenExit").hide();
			$(this.$div.selector + " input.fullscreen").hide();
			if(this.$paused !== true) {
				this.$timer = setInterval($.proxy(function(){this.slide(this.$options.rotation, this.$options.slide)}, this), this.$options.interval);
				this.$hovered = false;
				return this.$timer;
			}
			return undefined;
		},
		
		pauseOnButton: function(){
			this.$paused = true;
			$(this.$div.selector + " input.pause").hide();
			$(this.$div.selector + " input.play").show();
			this.$timer = clearInterval(this.$timer);
			return this.$timer;
		},
		
		playOnButton: function(){
			this.$paused = false;
			$(this.$div.selector + " input.play").hide();
			$(this.$div.selector + " input.pause").show();
			if(this.$hovered !== true){
				this.$timer = setInterval($.proxy(function(){this.slide(this.$options.rotation, this.$options.slide)}, this), this.$options.interval);
				return this.$timer;
			}
		},
		
		next: function(){
			this.slide("left");
		},
		
		previous: function(){
			this.slide("right");
		},
		
		
		fullscreen: function(){
			//this.$index = 1;
			
			this.$div.append("<div class = 'overlay'></>");
			
			$(this.$div.selector + " div.overlay").css({
				width :"100%",
				height : "100%",
				background: "black",
				position: "fixed",
				top: 0,
				bottom : 0,
				right: 0,
				left : 0,
				opacity: 0.9,
				"z-index": "100",
			});
			
			this.$width = $(document).width()-50;
			this.$height = this.$width/2;
			
			
			
			
			this.$div.css({
				"top" : "0px",
				"z-index" : "1500",
				"width": this.$width + "px",
				"height": this.$height + "px",
			});
			this.$ul.css({"z-index":"1500",});
			this.$li.css({width: this.$width,
				height: this.$height,
				background: "white",
			});
			this.setButtonProperties(1500);
			this.setChildProperties();
			this.$isFullscreen = true;
			//this.setCssForChild(0);
			
			$(this.$div.selector + " input.fullscreen").hide();
			$(this.$div.selector + " input.fullscreenExit").show();	
			if(this.$options.rotation === "left"){
				this.$index = 0;
			}else{
				this.$index = 2;
			}
			
			this.slide(this.$options.rotation);
			
		},
		
		fullscreenExit: function(){
			$('.overlay').remove();
			this.$width = 600;
			this.$height = this.$width/2;
			this.initCss();
			this.setChildProperties();
			this.$isFullscreen = false;
			$(this.$div.selector + " input.fullscreen").show();
			$(this.$div.selector + " input.fullscreenExit").hide();	
			//this.setCssForChild(0);
			if(this.$options.rotation === "left"){
				this.$index = 0;
			}else{
				this.$index = 2;
			}
			this.slide(this.$options.rotation);
			
		},
		
	/*	flickr: function(scope){
			var URL = "http://api.flickr.com/services/feeds/photos_public.gne";
			var jsonFormat = "&format=json&jsoncallback=?";
			var jURL = URL + "?" + jsonFormat;
			
			$.getJSON(jURL,{tags: "hello",tagmode: "any"},function(data) {
				$.each(data.items,function(i,photo) {
    				var photoHTML = '<li><img src="' + photo.media.m + '"/></li>';
    				scope.$ul.append(photoHTML);
				});

			});
			
		},*/
	};
}(jQuery));




