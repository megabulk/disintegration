var treeWalker, nodeArray = [], nodeArrayOriginalText = [], nodeArrayOriginalTextPure = [], charCount = 0, fuckedCounter, secondsPerLetter = .012, fuckRate, timeToStayFucked = 100, charsReplaced = 0, degreeOfFuckedness = degreeOfBkgFuckedness = 1;
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
			charCount += n.nodeValue.length;
		}
		
		$c(nodeArrayOriginalText);
				
		fuckRate = charCount / 3 * secondsPerLetter * 1000;
		
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
				}(i, j), Math.floor(Math.random() * fuckRate));
			}
		}
	}
	
	function fuck_unfuck(nodeToFuck, charToFuck, fuckMe) {
		var rndChar = chars.substr( Math.floor(Math.random() * chars.length - 1), 1);
		if (fuckMe === true) {
			fuckedCounter++;
			if (nodeArray[nodeToFuck].nodeValue.charAt(charToFuck) == ' ') {
				return;
			}
			newChar = rndChar;
			setTimeout(function() {
				fuck_unfuck(nodeToFuck, charToFuck)
			}, timeToStayFucked);
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
		nodeArrayOriginalText = JSON.parse(JSON.stringify(nodeArrayOriginalTextPure));;
		degreeOfFuckedness = 1;
		charsReplaced = 0;
		timeToStayFucked = 200;
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
		var bkgIntensity = Math.min(Math.floor(Math.random() * 255 * (degreeOfBkgFuckedness - 1)), 255);
		$('body').css({transition: 'none', backgroundColor: 'rgb(' + bkgIntensity + ',0,0)', color: 'rgb(0,255,255)'});
		setTimeout(function() {
			$('body').css({transition: 'background-color ' + (degreeOfFuckedness * 2) + 's, color ' + (degreeOfFuckedness / 30) + 's', backgroundColor: '#000', color: '#FFF'});
		}, timeToStayFucked * 2);
	}
	
});//end onload


//Dust object
function Everfalling(options) {
	this.dustBowl = [];
	this.self = this;
	this.docH = $(document).height();
	this.winW = $(window).width();
	this.dustOpacity = .3;
	
	this.makeDust = function() {
		var w = h = Math.floor(Math.random() * 10 * degreeOfBkgFuckedness) + 1;
		var x = Math.floor(Math.random() * 100);
		var y = Math.floor((Math.random() * ($(document).height() + ($(window).height() / 2)) / 10));
		y = Math.min(y, this.docH - y);
		if (w + x > 100) {
			w = 100 - x;
		}
		var lifespan = Math.floor(Math.random() * 10 * degreeOfBkgFuckedness) + 1;
		var opacity = Math.random() * this.dustOpacity;
		var d = new this.Dust({x:x, y:y, w:w, h:h, lifespan:lifespan, opacity:opacity}, this.self);
		this.dustBowl.push(d);
	}
	
	$(window).resize($.proxy(function() {
		this.docH = $(document).height();
		this.winW = $(window).width();
	}, this.self));
	
	this.removeDust = function(mote) {
		this.dustBowl = $.grep(this.dustBowl, function(e){ 
			return e.id != mote.id; 
		});
	}
	
	this.Dust = function(options, parent) {
		this.parent = parent;
		this.id = this.parent.dustBowl.length;
		
		this.disappear = function() {
			this.div.fadeOut(Math.floor(Math.random() * 3000) + 1000, function(dust) {
				$(this).remove();
				dust.parent.removeDust(dust);
			}(this));
		}
		
		this.icons = ['dustmote.svg', 'child.svg', 'mickey.svg'];

		this.settings = {
			x: 0,
			y: 0,
			w: 10,
			h: 10,
			bkg: 'url(images/' + this.icons[Math.floor(Math.random() * this.icons.length)] + ')',
			lifespan: 3,
			opacity: .5,
			death: this.disappear,
		}
	
		if (options) {
			$.extend(this.settings, options);
		}
	
		this.div = $("<div>", {class: "dust"}).css({
			left: this.settings.x + 'vw',
			top: this.settings.y + 'vh',
			width: this.settings.w + 'vw',
			height: this.settings.h + 'vw',
			opacity: this.settings.opacity,
			'background-image': this.settings.bkg,
		}).appendTo('#content');
		this.div.rotate(Math.floor(Math.random() * 360));

		setTimeout(this.settings.death.bind(this), this.settings.lifespan * 1000);
	}
}

function $c(x) {
	console.log(x);
}

jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};
