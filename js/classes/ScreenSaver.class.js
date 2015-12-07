'use strict';
/*
************ScreenSaver********** 

*****Reminder*****
This is an object, not a class. This is a singleton. Only one "instance" of this object is allowed at the same time.
This object use "ScreenSaver" as a namespace. Please do not use any other script with the same namespace to avoid conflicts.

*****Definition*****
ScreenSaver.class.js allows to manage a screen saver. It relies on a screensaver list.

*****Usage*****
Simply use the init method to set up the screen saver.
This method use a json object as a parameter.
Possible options are:
	delay: delay before the apparition of the screen saver (user inactivity time)
	type: screen saver type, to be chosen in the embedded library

*****Example***
//Screen saver 'snow', with a 2 minutes delay
ScreeSaver.init({delay : 120, type : 'snow'});

*****Methods*****
init: initialize code
start: detect inactivity and display screen saver if delay has been reached
stop: reset inactivity time and hide screen saver
*/

var ScreenSaver = {
	delay : 300,
	type : 'Snow',

	init : function(options) {
		for(var option in options) {
			this[option] = options[option];
		}
		this.inactivity = this.delay;
		document.body.addEventListener('mousemove', function(event) {ScreenSaver.stop(event)}, false);
		setInterval(function() {ScreenSaver.start()}, 1000);
	},

	start : function() {
		this.inactivity--;
		if(this.inactivity == 0) {
			eval(this.type + '.init()');
		}
	},

	stop : function() {
		if(this.inactivity < 0) {
			eval(this.type + '.stop()');
		}
		this.inactivity = this.delay;
	}
};

/*
Catalogue d'ecran de veille
Chaque ecran de veille doit necessairement avoir une methode init et une methode stop.
La methode init est appelee lors du declenchement de l'ecran de veille, c'est a dire lorsque le temps d'inactivité a atteint le delai.
La methode stop est appelee lors de la sortie de la veille, c'est a dire lorsque l'utilisateur bouge sa souris.
*/
var Snow = {
	//flakes
	density : 200,
	colors : new Array('#aac','#ddf','#ccd'),

	/*internal variables*/
	flakes : new Array(),
	interval : null,

	init : function() {
		for(var i = 0; i < this.density; i++) {
			this.createFlake(i);
		}
		this.interval = setInterval(function() {Snow.makeSnow()}, 60);
		//this.interval = setInterval((function(self) {return function() {self.makeSnow()}})(this), 60);
	},

	createFlake : function(index) {
		var flake = document.createElement('span');
		flake.appendChild(document.createTextNode('*'));
		document.body.appendChild(flake);
		this.flakes[index] = new Array;
		this.flakes[index]['flake'] = flake;
		this.flakes[index]['yaxis'] = Math.round(- Math.random() * window.innerHeight);
		this.flakes[index]['xaxis'] = Math.round(Math.random() * window.innerWidth);
		this.flakes[index]['direction'] = (Math.random() > 0.5) ? -0.3 : 0.3;
		flake.style.zIndex = '600';
		flake.style.fontSize = (Math.floor(Math.random() * 10) + 15) + 'px';
		flake.style.color = this.colors[Math.floor(Math.random() * 3)];
		flake.style.top = this.flakes[index]['yaxis'] + 'px';
		flake.style.left = this.flakes[index]['xaxis'] + 'px';
		flake.style.position = 'fixed';
	},

	makeSnow : function() {
		for(var i = 0; i < this.flakes.length; i++) {
			//bring up flakes which are at the bottom
			if(this.flakes[i]['yaxis'] > (window.innerHeight + 20)) {
				this.flakes[i]['yaxis'] = -10;
			}
			else {
				this.flakes[i]['yaxis'] = Math.round(Math.random()) + 1 + this.flakes[i]['yaxis'];
			}
			this.flakes[i]['flake'].style.top = this.flakes[i]['yaxis'] + 'px';
			//move flakes sidelong
			if((Math.random() + this.flakes[i]['direction']) < 0.5) {
				this.flakes[i]['xaxis']++;
				this.flakes[i]['direction'] = -0.3;
			}
			else {
				this.flakes[i]['xaxis']--;
				this.flakes[i]['direction'] = 0.3;
			}
			this.flakes[i]['flake'].style.left = this.flakes[i]['xaxis'] + 'px';
		}
	},

	stop : function() {
		clearInterval(this.interval);
		for(var i = 0; i < this.flakes.length; i++) {
			document.body.removeChild(this.flakes[i]['flake']);
			this.flakes[i]['flake'] = null;
		}
	}
};
