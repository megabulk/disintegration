var treeWalker, nodeArray = [], nodeArrayOriginalText = [], charCount = 0, fuckedCounter, fuckInterval = 100000;
var regex = /^\s+$/;
var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ®†¥©ßåœ™¢§¶Æ¯ÂÇßå[]";

jQuery(document).ready(function($) {

	init();

	function init() {
		var n;
		treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
		while (n = treeWalker.nextNode()) {
			if (n.nodeValue.match(regex)) {
				continue;
			}
			nodeArray.push(n);
			nodeArrayOriginalText.push(n.nodeValue);
			charCount += n.nodeValue.length;
		}
		
		initTextFuck();			
	}
	
	function initTextFuck() {
		fuckedCounter = 0;
		for (var i = 0; i < nodeArray.length; i++) {
			for (var j = 0; j < nodeArrayOriginalText[i].length; j++) {
				setTimeout(function(i, j) {
					return function() {
						fuck_unfuck(i, j, true);
					}
				}(i, j), Math.floor(Math.random() * fuckInterval));
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
			}, Math.floor(Math.random() * 500) + 8000);
		} else {
			//permanent decay!
			if (Math.random() > .999) {
				nodeArrayOriginalText[nodeToFuck] = replaceChar(nodeArrayOriginalText[nodeToFuck], rndChar, charToFuck);
			}
			newChar = nodeArrayOriginalText[nodeToFuck].charAt(charToFuck);
		}
		var newStr = nodeArray[nodeToFuck].nodeValue;
		newStr = replaceChar(newStr, newChar, charToFuck);
		nodeArray[nodeToFuck].nodeValue = newStr;
		if (fuckedCounter == charCount) {
			initTextFuck();
			document.querySelector("body").style.backgroundColor = "#DDD";
			setTimeout(function() {
				document.querySelector("body").style.backgroundColor = "#000";
			}, 200);
		}
	}
	
	function replaceChar(str, newChar, index) {
		newStr = str.substr(0, index) + newChar + str.substr(index + 1);
		return newStr;
	}
	
});//end onload

function $c(x) {
	console.log(x);
}
