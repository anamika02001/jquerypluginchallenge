/*
Author: Anamika Mukherji

Title: Hoop

Description: Hoop is an open source jQuery plugin for timed slide show. 
The plugin takes an unorderlist of images and creates a timed slideshow. 
This is an open source plugin. Feel free to use it and modify it.
jQuery, jQeury-ui and jQuery-mobile are required for this plugin.

Download jQuery from http://jquery.com/
Download jQuery-ui from http://jqueryui.com/
Download jQuery-mobile from http://jquerymobile.com/

Documentation: http://www-scf.usc.edu/~mukherji/hoop/Hoop.html
*/

(function($){
	/*
		Plugin Definition
	*/
	$.fn.hoop = function(options){
			return new Hoop($(this), $.extend({}, Hoop.defaults, options));
	};
	
	$.fn.hoop.Constructor = Hoop;
	
	/*
		Constructor definition
	*/
	var Hoop = function(element, options){
		this.$div = $(element);
		this.$ul = $(this.$div.selector + " ul");
		this.$li = $(this.$div.selector + " ul li");
		this.$options = options;
		if(this.$options.elementSource === "flickr"){
			this.flickr(this);
		}else if(this.$options.elementSource === "instagram"){
			this.instagram(this);
		}
		this.$maxSize = this.$ul.children().size();
		this.$width = 600;
		this.$height = 300;
		this.$index = 1;
		this.$isFullscreen = false;
		this.$zIndex = 2;
		this.init();
		this.initCss();
		this.setButtonProperties();
		this.initEventHandlers();
	};
	
	/*
		Set the default values of each option
	*/
	Hoop.defaults = {
		interval : 2000,
		rotation : "left",
		elementSource : "none",
		tags : null,
		clientID : null,
	};
	
	/*
		Definition of the methods in Hoop
	*/
	Hoop.prototype = {
		/* 
			The init function appends all the buttons, namely, play, pause, previous, next, fullscreen and fullscreen exit 
			to the div dom element. It also initializes the progress bar using jQuery-ui.
		*/ 
		init: function(){
			this.$div.append("<input type='image' class = 'previous' src='images/previous.png' alt='Previous'/>");
			this.$div.append("<input type='image' class = 'next' src='images/next.png' alt='Next'/>");	
			this.$div.append("<input type='image' class = 'pause' src='images/pause.png' alt='Pause'/>");
			this.$div.append("<input type='image' class = 'play' src='images/play.png' alt='Play'/>");
			this.$div.append("<input type='image' class = 'fullscreenExit' src='images/fullscreenExit.png' alt='FullscreenExit'/>");
						this.$div.append("<input type='image' class = 'fullscreen' src='images/fullscreen.png' alt='Fullscreen'/>");
			this.$div.append("<div class='progressBar'></div>");
			if(this.$options.elementSource === "none"){
				$(this.$div.selector + " div.progressBar").progressbar({
					max: this.$maxSize,
					value: this.$index
				});
			}
			$(this.$div.selector + " input.play").hide();
		},
		
		/*
			initCss initializes the Css for the div, ul and all the li elements. It also makes the plugin responsive by resizing the
			elements according to the width and height of the window.
		*/
		initCss: function(){
			if($(window).width() >= 600 && this.$isFullscreen === false){	
				this.$width = "600";				
				this.$height = "300";
			}else if($(window).width() >= 600 && this.$isFullscreen === true){	
				this.$width = $(document).width()-50;
				this.$height = this.$width/2;
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
				"z-index" : this.$zIndex,
			});
			this.$ul.css({
				"position" : "absolute",
				"list-style-type": "none",
				"width": this.$width*this.$height*this.$maxSize + "px",
				"float" : "left",
				"margin": "0px",
				"padding": "0px",
				"z-index" : this.$zIndex,
			});
			this.$li.css({
				"position":"relative",
				"float":"left",
				"width": this.$width,
				"height": this.$height,
				"text-align" : "center",
				"margin": "0px",
				"padding": "0px",
				"z-index" : this.$zIndex,
			});
		},
		
		/*
			setButtonProperties sets the Css of the buttons and the progress bar.
		*/
		setButtonProperties: function(){
			buttonSize = 0.07 * this.$width;
			$(this.$div.selector + " input.previous").css({
				"position": "absolute",
				"left": "0px",
				"float": "left",
				"top": (this.$height/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": this.$zIndex + 2,
			});	
			
			$(this.$div.selector + " input.next").css({
				"position": "absolute",
				"float": "left",
				"top": this.$height/2 + "px",
				"left": (this.$width - buttonSize) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": this.$zIndex + 2,
			});	
			$(this.$div.selector + " input.pause").css({
				"position": "absolute",
				"float": "left",
				"top": this.$height*0.75 + "px",
				"left": (this.$width/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": this.$zIndex + 2,
			});	
			$(this.$div.selector + " input.play").css({
				"position": "absolute",
				"float": "left",
				"top": this.$height*0.75 + "px",
				"left": (this.$width/2) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": this.$zIndex + 2,
			});	
			$(this.$div.selector + " div.progressBar").css({
				"position": "absolute",
				"top": (this.$height - 5 ) + "px",
				"z-index": this.$zIndex,
				"height": "3px",
				"width" : this.$width + "px",
			});
			$(this.$div.selector + " input.fullscreen").css({
				"position": "absolute",
				"top": (this.$height - buttonSize - buttonSize/4) + "px",
				"left": (this.$width - buttonSize) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": this.$zIndex + 2,
			});
			$(this.$div.selector + " input.fullscreenExit").css({
				"position": "absolute",
				"top": (this.$height - buttonSize - buttonSize/4) + "px",
				"left": (this.$width - buttonSize) + "px",
				"width": buttonSize + "px",
				"height": buttonSize + "px",
				"z-index": this.$zIndex + 2,
			});
		},
		
		/*
			initEventHandlers binds all the events with their respective event handlers.
		*/
		initEventHandlers: function(){
			var scope = this;
			this.$div.mouseover($.proxy(this.pauseOnMouseOver,this));
			this.$div.mouseout($.proxy(this.playOnMouseOut,this));
			$(window).resize($.proxy(function(){
				this.initCss();
				this.setButtonProperties();
			}, scope));
			this.$div.on("swipeleft",$.proxy(this.next, scope));
			this.$div.on("swiperight",$.proxy(this.previous, scope));
			$(window).load($.proxy(function(){
				if(this.$options.elementSource === "flickr" || this.$options.elementSource === "instagram" ){
					this.setPropertiesImageSource();
				}
				this.getNaturalSize();
				this.setListChildProperties();
				var video = this.$li.children().eq(0);
				if(video && video[0] && video[0].nodeName && video[0].nodeName.toUpperCase() === "VIDEO" ){
					video.on("play",$.proxy(function(){ 
						this.pauseOnButtonClick();
						return;
					},this));
					video.on("pause",$.proxy(function(){
						this.playOnButtonClick();
					 	return;
				 	},this));
				}
				this.pauseAllVideos();
				this.$timer = this.playOnMouseOut();
				
			}, scope));
			$(this.$div.selector + " input.next").click($.proxy(this.next, this));
			$(this.$div.selector + " input.previous").click($.proxy(this.previous, this));
			$(this.$div.selector + " input.fullscreen").click($.proxy(this.fullscreen, this));
			$(this.$div.selector + " input.pause").click($.proxy(this.pauseOnButtonClick,this));
			$(this.$div.selector + " input.play").click($.proxy(this.playOnButtonClick,this));
			$(this.$div.selector + " input.fullscreenExit").click($.proxy(this.fullscreenExit,this));
		},
		
		/*
			setPropertiesImageSource resets the properties of div, ul, li , progressbar, etc when an ImageSource like Instagram or 
			Flickr is available.
		*/
		setPropertiesImageSource: function(){
			this.$li = $(this.$div.selector + " ul li");
			this.$maxSize = this.$ul.children().size();
			$(this.$div.selector + " div.progressBar").progressbar({
				max: this.$maxSize,
				value: this.$index
			});
			this.initCss();
		},
		
		/*
			getNaturalSize preserves the natural height and width of each child element of each li in ul
		*/
		getNaturalSize : function(){
			for(i = 0; i< this.$maxSize; i++){
				var child = this.$li.children().eq(i);
				child.attr("naturalHeight",child.height());
				child.attr("naturalWidth",child.width());
			}
			
		},
		
		setListChildProperties: function(){
			for(i = 0; i< this.$maxSize; i++){
				this.setCssForElement(i);
			}
		},
		
		/*
			setCssForElement sets the width and height of the elements to be displayed(images/videos) according to the window width
			and height. It maintains the ratio of width to height without stretching or cropping the elements.
		*/
		setCssForElement : function(indexOfChild){
			var child = this.$li.children().eq(indexOfChild);
			
			if(child && child[0] && child[0].nodeName && child[0].nodeName.toUpperCase() === "VIDEO"){
		        var height = child[0].videoHeight;
		        var width = child[0].videoWidth;
		        if(height > this.$height || width > this.$width ){
					if(width > height){
						height = height*this.$width/width;
						width = this.$width;
						if(height > this.$height){
							width = this.$height*width/height;
							height = this.$height;
						}
					}else {
						width = this.$height*width/height;
						height =  this.$height;
						if(width > this.$width){
							height = this.$width*height/width;
							width = this.$width;
						}
					}
				}
				child[0].width = width;
				child[0].height = height;
				var topMargin = ((this.$height > height)?((this.$height - height)/2): 0);
				child.css({"margin-top" : topMargin + "px"});
		    }else{
				var height = parseInt(child.attr("naturalHeight"),10);
				var width = parseInt(child.attr("naturalWidth"),10);
			
				if(height > this.$height || width > this.$width ){
					if(width > height){
						height = height*this.$width/width;
						width = this.$width;
						if(height > this.$height){
							width = this.$height*width/height;
							height = this.$height;
						}
					}else {
						width = this.$height*width/height;
						height =  this.$height;
						if(width > this.$width){
							height = this.$width*height/width;
							width = this.$width;
						}
					}
				}
				var topMargin = ((this.$height > height)?((this.$height - height)/2): 0);
				child.css({width: width + "px", height: height + "px", "margin-top" : topMargin + "px" });
			}
		},
		
		/*
			slide function slides the elements according to the direction and interval. It also fires a callback function after 
			every slide transition.
		*/
		slide: function(direction, callback){
			var videoIndex;
			if(direction === "left"){
				this.$index++;
				if(this.$index === this.$maxSize + 1){
					this.$index = 1;
				}
				videoIndex = this.$index;
				$(this.$div.selector + " div.progressBar").progressbar({value: this.$index});
				this.$ul.animate({"left": -((this.$index -1)* this.$width) + "px"},this.$interval > 1000 ? this.$interval - 1000 : this.$interval);
			}else{
				this.$index--;
				if(this.$index === 0){
					this.$index = this.$maxSize;
				}
				videoIndex = this.$index-1;
				$(this.$div.selector + " div.progressBar").progressbar({value: this.$index});
				this.$ul.animate({"left": (-(this.$index -1) * this.$width) + "px"},this.$interval > 1000 ? this.$interval - 1000 : this.$interval);
			}
			if(videoIndex < this.$maxSize){
				var video = this.$li.children().eq(videoIndex);
				if(video && video[0] && video[0].nodeName && video[0].nodeName.toUpperCase() === "VIDEO"){
					video.on("play",$.proxy(function(){ 
						this.pauseOnButtonClick();
						return;
					},this));
					video.on("pause",$.proxy(function(){
						this.playOnButtonClick();
					 	return;
				 	},this));
				}
			}
			this.setCssForElement(this.$index - 1);
			if(callback != undefined){
				callback();
			}
		},
		
		/*
			pauseOnMouseOver pauses the slideshow when the mouse is over the element.
		*/
		pauseOnMouseOver: function(){
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
		
		/*
			playOnMouseOut continues the slideshow after the mouse pointer is hovered out of the ul area.
		*/
		playOnMouseOut: function(){
			$(this.$div.selector + " input.next").hide();
			$(this.$div.selector + " input.previous").hide();
			$(this.$div.selector + " input.pause").hide();
			$(this.$div.selector + " input.play").hide();
			$(this.$div.selector + " div.progressBar").show();
			$(this.$div.selector + " input.fullscreenExit").hide();
			$(this.$div.selector + " input.fullscreen").hide();
			if(this.$paused !== true) {
				this.$timer = clearInterval(this.$timer);
				this.$timer = setInterval($.proxy(function(){this.slide(this.$options.rotation, this.$options.slide)}, this), this.$options.interval);
				this.$hovered = false;
				return this.$timer;
			}
			return undefined;
		},
		
		/*
			pauseOnButtonClick pauses the slideshow .
		*/
		pauseOnButtonClick: function(){
			this.$paused = true;
			$(this.$div.selector + " input.pause").hide();
			$(this.$div.selector + " input.play").show();
			this.$timer = clearInterval(this.$timer);
			return this.$timer;
		},
		
		/*
			playOnButtonClick resumes the slideshow.
		*/
		playOnButtonClick: function(){
			this.pauseAllVideos();
			this.$paused = false;
			$(this.$div.selector + " input.play").hide();
			$(this.$div.selector + " input.pause").show();
			if(this.$hovered !== true){
				this.$timer = clearInterval(this.$timer);
				this.$timer = setInterval($.proxy(function(){this.slide(this.$options.rotation, this.$options.slide)}, this), this.$options.interval);
				return this.$timer;
			}
		},
		
		/*
			Moves to the next element in the queue.
		*/
		next: function(){
			this.pauseAllVideos();
			this.slide("left");
		},
		
		/*
			Moves to the previous element in the queue
		*/
		previous: function(){
			this.pauseAllVideos();
			this.slide("right");
		},
		
		/*
			pauses all the videos in the ul
		*/
		pauseAllVideos: function(){
			for(i = 0; i< this.$maxSize; i++){
				var video = this.$li.children().eq(i);
				if(video && video[0] && video[0].nodeName && video[0].nodeName.toUpperCase() === "VIDEO"){
					video[0].pause();
				}
			}
		},
		
		/*
			fullscreen makes the slideshow fullscreen by adjusting div and all its child elements according to the window width and height
		*/
		fullscreen: function(){
			this.pauseAllVideos();
			this.$div.wrap("<div class = 'overlay'></>");
			$("div.overlay").css({
				width :"100%",
				height : "100%",
				background: "black",
				position: "fixed",
				top: 0,
				bottom : 0,
				right: 0,
				left : 0,
				opacity: 1,
				"z-index": "1000",
			});
			this.$width = $(document).width()-50;
			this.$height = this.$width/2;
			this.$zIndex = 1500;
			this.$div.css({
				"top" : "0px",
				"z-index" : this.$zIndex,
				"width": this.$width + "px",
				"height": this.$height + "px",
			});
			this.$ul.css({"z-index":this.$zIndex,});
			this.$li.css({width: this.$width,
				height: this.$height,
				background: "white",
			});
			this.setButtonProperties();
			this.setListChildProperties();
			this.$isFullscreen = true;
			$(this.$div.selector + " input.fullscreen").hide();
			$(this.$div.selector + " input.fullscreenExit").show();	
			if(this.$options.rotation === "left"){
				this.$index = 0;
			}else{
				this.$index = 2;
			}
			this.slide(this.$options.rotation);
			
		},
		
		/*
			fullscreenExit exits the full screen mode.
		*/
		fullscreenExit: function(){
			this.pauseAllVideos();
			this.$isFullscreen = false;
			this.$div.unwrap();
			this.$width = 600;
			this.$height = this.$width/2;
			this.$zIndex = 2;
			this.initCss();
			this.setListChildProperties();
			this.setButtonProperties();
			$(this.$div.selector + " input.fullscreen").show();
			$(this.$div.selector + " input.fullscreenExit").hide();	
			if(this.$options.rotation === "left"){
				this.$index = 0;
			}else{
				this.$index = 2;
			}
			this.slide(this.$options.rotation);
		},
		
		/*
			Pulls top 20 images from public feeds of Flickr depending upon the tag specified.
		*/
		flickr: function(scope){
			var url = "http://ycpi.api.flickr.com/services/feeds/photos_public.gne?&format=json&jsoncallback=?";
			$.getJSON(url,{tags: scope.$options.tags},function(data) {
				$.each(data.items,function(i,photo) {
    				var photoHTML = '<li><img src="' + photo.media.m + '"/></li>';
    				scope.$ul.append(photoHTML);
				});
			});
		},
		
		/*
			Pulls recent images from Instagram depending upon the tags specified. 
		*/
		instagram: function(scope){
			if(scope.$options.tags === ""){
				var url = "https://api.instagram.com/v1/media/popular?client_id="+scope.$options.clientID+"&callback=?"; 
			}else {
				var url = "https://api.instagram.com/v1/tags/"+scope.$options.tags+"/media/recent?client_id="+scope.$options.clientID+"&callback=?"; 
			}
			$.getJSON( url, function(data){
    			$.each(data.data, function(key,item){
       				$.each(item, function(instaImage, attributes){
       					 if(instaImage === "images"){
       					 	$.each(attributes, function(stdImage, stdAttr){
       					 		if(stdImage === "standard_resolution"){
    								scope.$ul.append('<li><img src="' + stdAttr.url + '"/></li>');
       					 		}
       					 	});
       					 }
       				});
       			});
			});
		},
	};
}(jQuery));