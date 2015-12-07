'use strict';

function Slider(parameters) {

	/*parameters*/
	this.min = 5;
	this.max = 100;
	this.magnet = 5;
	this.defaultValue; //default value, works only if no input is specified

	this.place; //place where slider will be inserted
	this.input; //input form linked to the slider

	//bar
	this.barBackground;
	this.barWidth = 0;
	this.barHeight = 0,

	//cursor
	this.cursorBackground;
	this.cursorWidth = 0;
	this.cursorHeight = 0;
	//warning, cursor width should be odd in order to have a middle
	this.cursorMarginLeft = 0,
	this.cursorMarginRight = 0,

	this.callback;

	//bind parameters
	for(var parameter in parameters) {
		this[parameter] = parameters[parameter];
	}

	var that = this;

	/*internal variables*/
	this.handlers = [],
	this.bar = {},
	this.cursor = {},

	//attention, la plage - qui vaut la largeur du conteneur auquel sont soustraits la somme des marges et la largeur du curseur - doit etre un multiple de l'aimant
	//warning, range - which worth bar width minored by cursor width and cursor margins - must be a magnet multiple
	this.offset = 0; //offset between left node x-axis and mouse x-axis when catching the cursor
	this.middle = Math.round(this.cursorWidth / 2); //middle of the cursor, which is the real and good position for slider value
	this.range = this.barWidth - this.cursorMarginLeft - this.cursorMarginRight; //slider range in pixels
	this.notch = this.range / (this.max - this.min); //pixel size of a unit

	//create bar
	this.bar = document.createElement('div');
	this.bar.style.position = 'relative';
	this.bar.style.height = this.barHeight + 'px';
	this.bar.style.width = this.barWidth + 'px';
	this.bar.style.backgroundColor = this.barBackgroundColor;
	if(this.barBackground) {
		this.bar.style.backgroundImage = 'url(' + this.barBackground + ')';
	}

	//create cursor
	this.cursor = document.createElement('div');
	this.cursor.style.position = 'absolute';
	this.cursor.style.height = this.cursorHeight + 'px';
	this.cursor.style.width = this.cursorWidth + 'px';
	this.cursor.style.cursor = 'pointer';
	this.cursor.style.backgroundColor = this.cursorBackgroundColor;
	if(this.cursorBackground) {
		this.cursor.style.backgroundImage = 'url(' + this.cursorBackground + ')';
	}

	//adding elements
	this.bar.appendChild(this.cursor);
	this.place.appendChild(this.bar);

	//setting default value
	if(this.input) {
		this.setValue(this.input.value);
		this.input.addEventListener('change', function(event) {that.setValue(parseInt(this.value))}, false);
	}
	else {
		this.setValue(this.defaultValue);
	}

	//add listener
	this.cursor.addEventListener('mousedown', function(event) {that.start(event)}, false);
	this.bar.addEventListener('click', function(event) {that.click(event)}, false);
};

Slider.prototype.setValue = function(value) {
	//correct value if not in range
	if(value < this.min) {
		value = this.min;
	}
	if(value > this.max) {
		value = this.max;
	}
	if(value % this.magnet != 0) {
		value = Math.round(value / this.magnet) * this.magnet;
	}
	//set cursor
	this.cursor.style.left = Math.round((value - this.min) * this.notch) - this.cursorMarginLeft - this.middle + 'px';
	//set input
	if(this.input) {
		this.input.value = value;
	}
	//execute callback
	if(this.callback) {
		this.callback(value);
	}
};

Slider.prototype.click = function(event) {
	//retrieve pointer position
	var value = (event.clientX - this.bar.getBoundingClientRect().left + window.scrollX) / this.notch + this.min;
	this.setValue(value);

	//stop event
	event.preventDefault();
	event.stopPropagation();
};

Slider.prototype.start = function(event) {
	//retrieve handle position on cursor
	this.offset = event.layerX;
	//ui modifications
	this.cursor.style.cursor = 'e-resize';
	document.body.style.cursor = 'e-resize';
	this.cursor.style.opacity = 0.8;

	//add listeners
	var that = this;
	this.handlers['slide'] = function(event) {that.slide(event)};
	this.handlers['stop'] = function(event) {that.stop(event)};
	document.addEventListener('mousemove', this.handlers['slide'], false);
	document.addEventListener('mouseup', this.handlers['stop'], false);

	//stop event
	event.preventDefault();
	event.stopPropagation();
};

Slider.prototype.slide = function(event) {
	//retrive offset
	var offset = 0;
	var node = this.bar;
	while(node.offsetLeft != 0) {
		offset += node.offsetLeft;
		node = node.offsetParent;
	}
	//retrieve pointer position
	var pixel = event.clientX - offset - this.offset;
	var value = (pixel + this.middle) / this.notch + this.min;
	this.setValue(value);

	//stop event
	event.preventDefault();
	event.stopPropagation();
};

Slider.prototype.stop = function(event) {
	//display modification
	document.body.style.cursor = 'default';
	this.cursor.style.cursor = 'pointer';
	this.cursor.style.opacity = 1;

	//deleting listeners
	document.removeEventListener('mousemove', this.handlers['slide'], false);
	document.removeEventListener('mouseup', this.handlers['stop'], false);

	//stop event
	event.preventDefault();
	event.stopPropagation();
};
