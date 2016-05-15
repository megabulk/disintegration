var treeWalker, nodeArray = [], nodeArrayOriginalText = [], nodeArrayOriginalTextPure = [], nodeArrayCharCounts = [], charCount = 0, fuckedCounter, secondsPerLetter = .01, fuckRate, timeToStayFucked = 100, charsReplaced = 0, degreeOfFuckedness = degreeOfBkgFuckedness = 1, scrollPercent = 0;
var regex = /^\s+$/;
var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ®†¥©ßåœ™¢§¶Æ¯ÂÇßå[]";

jQuery(document).ready(function($) {

	var dust = new Everfalling();
	
	init();

	function init() {
		var n;
		treeWalker = document.createTreeWalker(document.getElementById("content"), NodeFilter.SHOW_TEXT);
		while (n = treeWalker.nextNode()) {
			if (n.nodeValue.match(regex)) {
				continue;
			}
			nodeArray.push(n);
			nodeArrayOriginalText.push(n.nodeValue);
			nodeArrayOriginalTextPure.push(n.nodeValue);
			nodeArrayCharCounts.push(charCount);
			charCount += n.nodeValue.length;
		}
				
		fuckRate = charCount / 3 * secondsPerLetter * 1000;
		
		$(window).trigger('scroll');
		
		setTimeout(initTextFuck, fuckRate / 2);
	}
	
	function initTextFuck() {
		fuckedCounter = 0;
		for (var i = 0; i < nodeArray.length; i++) {
			for (var j = 0; j < nodeArrayOriginalText[i].length; j++) {
				setTimeout(function(i, j) {
					return function() {
						fuck_unfuck(i, j, true);
					}
				}(i, j), rand(fuckRate));
			}
		}
	}
	
	function fuck_unfuck(nodeToFuck, charToFuck, fuckMe) {
		var rndChar = chars.substr( rand(chars.length - 1), 1);
		var charPos = nodeArrayCharCounts[nodeToFuck] + charToFuck;
		var charPercent = charPos / charCount;
		if (fuckMe === true) {
			fuckedCounter++;
			char = nodeArray[nodeToFuck].nodeValue.charAt(charToFuck);
			if (char == ' ' || char.match(/\r\n|\r|\n/g)) {
				return;
			}
			newChar = rndChar;
			setTimeout(function() {
				fuck_unfuck(nodeToFuck, charToFuck)
			}, timeToStayFucked * (charPercent + 1));
		} else {
			//permanent decay!
			if (Math.random() > .9987 / (degreeOfFuckedness/2)) {
				nodeArrayOriginalText[nodeToFuck] = replaceChar(nodeArrayOriginalText[nodeToFuck], rndChar, charToFuck);
				charsReplaced++;
				if (charsReplaced * 2.5 > charCount) {
					reset();
				}
			}
			newChar = nodeArrayOriginalText[nodeToFuck].charAt(charToFuck);
		}
		var newStr = nodeArray[nodeToFuck].nodeValue;
		newStr = replaceChar(newStr, newChar, charToFuck);
		nodeArray[nodeToFuck].nodeValue = newStr;
		if (fuckedCounter == charCount) {
			increaseTheFuck();
		}
	}
	
	function reset() {
		nodeArrayOriginalText = JSON.parse(JSON.stringify(nodeArrayOriginalTextPure));
		degreeOfFuckedness = 1;
		charsReplaced = 0;
		timeToStayFucked = 100;
	}
	
	function replaceChar(str, newChar, index) {
		newStr = str.substr(0, index) + newChar + str.substr(index + 1);
		return newStr;
	}
		
	setTimeout(function() {
		setInterval(function() {
			dust.makeDust();
		}, 100);
	}, fuckRate * 1.2);

	function increaseTheFuck() {
		initTextFuck();
		degreeOfFuckedness *= 1.1;
		degreeOfBkgFuckedness *= 1.1;
		if (timeToStayFucked < fuckRate - 2000) {
			timeToStayFucked *= degreeOfFuckedness;
		}
		dust.dustOpacity = Math.min(dust.dustOpacity * degreeOfBkgFuckedness, 1);
		var bkgIntensity = Math.min(rand(255 * (degreeOfBkgFuckedness - 1)), 255);
		var r = Math.round(Math.random()) * 255;
		var g = Math.round(Math.random()) * 255;
		var b = Math.round(Math.random()) * 255;
		$('body').css({transition: 'none', backgroundColor: 'rgb(' + bkgIntensity + ',0,0)', color: 'rgb(' + r + ',' + g + ',' + b + ')'});
		setTimeout(function() {
			$('body').css({transition: 'background-color ' + (degreeOfFuckedness * 2) + 's, color ' + (degreeOfFuckedness / 10) + 's', backgroundColor: '#000', color: '#FFF'});
		}, timeToStayFucked * 2);
	}
	
	$('#morelink').mouseover(function() {
		$('#content, #dustholder').css('visibility', 'hidden');
	});
	
	$('#morelink').mouseout(function() {
		$('#content, #dustholder').css('visibility', 'visible');
	});
	
	$(window).scroll(function() {
		scrollPercent = ($(this).scrollTop()) / ($(document).height() - $(this).height());
		scrollPercent = Math.max(0, scrollPercent);
		scrollPercent = Math.min(1, scrollPercent);
	});

});//end onload


//Dust object
function Everfalling(options) {
	this.dustBowl = [];
	this.self = this;
	this.dustOpacity = .3;
	
	this.makeDust = function() {
		var w = h = Math.min(80, rand(10 * degreeOfBkgFuckedness) + 1.5);
		var x = rand(100) - w / 2;
		var y = rand($(document).height() / $(window).width() * 100) - h / 2;
		//the lower on the page, the more fucked
		var percentY = this.vw_to_px(y) / $(document).height();
		w *= (percentY + 1);
		h = w;
		var lifespan = rand(10 * degreeOfBkgFuckedness * (percentY + 1)) + 1;
		var opacity = Math.random() * this.dustOpacity;
		var d = new this.Dust({x:x, y:y, w:w, h:h, lifespan:lifespan, opacity:opacity}, this.self);
		this.dustBowl.push(d);
	}
	
	this.removeDust = function(mote) {
		this.dustBowl = $.grep(this.dustBowl, function(e){ 
			return e.id != mote.id; 
		});
	}
	
	this.Dust = function(options, parent) {
		this.parent = parent;
		this.id = this.parent.dustBowl.length;
		
		this.disappearFade = function() {
			this.div.fadeOut(rand(3000) + 1000, function(dust) {
				$(this).remove();
				clearInterval(dust.spinTimer);
				dust.parent.removeDust(dust);
			}(this));
		}
		
		this.disappearShrink = function() {
			var centerX = this.settings.x + rand(this.settings.w);
			var centerY = this.settings.y + rand(this.settings.h);
			this.div.animate({backgroundSize: "0%", left: centerX + 'vw', top: centerY + 'vw'}, {
			}, rand(3000 * degreeOfBkgFuckedness) + 1000, function(dust) {
				$(this).remove();
				clearInterval(dust.spinTimer);
				dust.parent.removeDust(dust);
			}(this));
		}
		
		this.disappearSquish = function() {
			var centerX = this.settings.x + rand(this.settings.w);
			var centerY = this.settings.y + rand(this.settings.h);
			if (rand(2)) {
				endW = 1;
				endH = 0;
			} else {
				endW = 0;
				endH = 1;
			}
			this.div.animate({left: centerX + 'vw', top: centerY + 'vw'}, {
				step: function(now, fx) {
					if (fx.prop == 'top') {
						w = endW ? 1 : 1 - fx.pos;
						h = endH ? 1 : 1 - fx.pos;
						rot = $(this).data('rotation');
						$(this).transform('scale(' + w + ',' + h + ') rotate(' + rot + 'deg)');
					}
				}
			}, rand(3000 * degreeOfBkgFuckedness) + 1000, function(dust) {
				$(this).remove();
				clearInterval(dust.spinTimer);
				dust.parent.removeDust(dust);
			}(this));
		}
		
		this.disappearances = [
			this.disappearFade,
			this.disappearShrink,
			this.disappearSquish,
		];
		
		this.spinMe = function() {
			this.spinTimer = setInterval(function(self) {
				direction = self.settings.spin_direction ? 1 : -1;
				rotation = self.div.data('rotation') + .3 * direction;
				self.div.rotate(rotation);
				self.div.data('rotation', rotation);
			}, 100, this);
		};

		this.icons = ['dustmote.svg', 'child.svg', 'mickey.svg', 'widget.svg', 'flag.svg', 'star.svg', 'black_sun.svg', 'barcode.svg',];

		this.settings = {
			x: 0,
			y: 0,
			w: 10,
			h: 10,
			bkg: 'url(images/' + this.icons[rand(this.icons.length)] + ')',
			lifespan: 3,
			opacity: .5,
			death: this.disappearances[rand(this.disappearances.length)],
			spinning: rand(100) > 80,
			spin_direction: rand(2)
		}
	
		if (options) {
			$.extend(this.settings, options);
		}
	
		this.div = $("<div>", {class: "dust"}).css({
			left: this.settings.x + 'vw',
			top: this.settings.y + 'vw',
			width: this.settings.w + 'vw',
			height: this.settings.h + 'vw',
			opacity: this.settings.opacity,
			'background-image': this.settings.bkg,
		}).appendTo('#dustholder');
		rotation = rand(360);
		this.div.rotate(rotation).data('rotation', rotation);
		if (this.settings.spinning) {
			this.spinMe();
		}
		
		setTimeout(this.settings.death.bind(this), this.settings.lifespan * 1000);
	}

	this.px_to_vw = function(px) {
		return px / $(window).width() * 100;
	}

	this.vw_to_px = function(vw) {
		return vw / 100 * $(window).width();
	}
	
}


function $c(x) {
	console.log(x);
}

function rand(limit) {
	return Math.floor(Math.random() * limit);
}

jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};

jQuery.fn.transform = function(transform) {
    $(this).css({'-webkit-transform' : transform,
                 '-moz-transform' : transform,
                 '-ms-transform' : transform,
                 'transform' : transform});
    return $(this);
};
