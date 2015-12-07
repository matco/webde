'use strict';
/*
************Resize**********

*****Reminder*****
This is an object, not a class. This is a singleton. Only one "instance" of this object is allowed at the same time.
This object use "Resize" as a namespace. Please do not use any other script with the same namespace to avoid conflicts.

*****Definition*****
Resize allows to resize any node of a html document.

*****Usage*****
Resize.add(node);
node will be resizable

*****Methods*****
monitor: monitor mouse position and prepare node if mouse is close to the border of element
drag: start and manage resizing
drop: end resizing action
resize: resize node
*/

var Resize = {

	//variables d'environnement
	margin : 5, //marge qui determine de combien de pixel l'utilisateur doit se rapprocher du bord du noeud pour le redimensionner
	minHeight : 50, //determine la hauteur minimum pour le noeud (le redimensionnement n'est plus possible lorsque la valeur est atteinte)
	minWidth : 130, //determine la largeur minimum pour le noeud (le redimensionnement n'est plus possible lorsque la valeur est atteinte)
	way : false, //type de dimensionnement (horizontal, vertical ou diagonal)
	currentResize : null, //variable contenant le noeud en cours de dimensionnement

	add : function(node) {
		node.addEventListener('mousemove', Resize.monitor, false);
	},

	remove : function(node) {
		node.removeEventListener('mousemove', Resize.monitor, false);
	},

	monitor : function(event) {
		if(event.clientX > (this.offsetLeft + this.offsetWidth - Resize.margin) && event.clientX < (this.offsetLeft + this.offsetWidth + Resize.margin) && event.clientY > (this.offsetTop + this.offsetHeight - Resize.margin) && event.clientY < (this.offsetTop + this.offsetHeight + Resize.margin)) {
			this.addEventListener('mousedown', Resize.drag, true);
			this.style.cursor = 'nw-resize';
			Resize.way = 'diagonal';
			return true;
		}
		if(event.clientX > (this.offsetLeft + this.offsetWidth - Resize.margin) && event.clientX < (this.offsetLeft + this.offsetWidth + Resize.margin)) {
			this.addEventListener('mousedown', Resize.drag, true);
			this.style.cursor = 'e-resize';
			Resize.way = 'horizontal';
			return true;
		}
		else if(event.clientY > (this.offsetTop + this.offsetHeight - Resize.margin) && event.clientY < (this.offsetTop + this.offsetHeight + Resize.margin)) {
			this.addEventListener('mousedown', Resize.drag, true);
			this.style.cursor = 'n-resize';
			Resize.way = 'vertical';
			return true;
		}
		else {
			this.removeEventListener('mousedown', Resize.drag, true);
			this.style.cursor = 'default';
		}
		event.preventDefault();
	},

	drag : function(event) {
		switch(Resize.way) {
			case('vertical') : document.body.style.cursor = 'n-resize'; break;
			case('horizontal') : document.body.style.cursor = 'e-resize'; break;
			case('diagonal') : document.body.style.cursor = 'nw-resize'; break;
		}
		//keep a link to dragged node
		Resize.currentResize = this;
		//remove listeners
		this.removeEventListener('mousemove', Resize.monitor, false);
		this.removeEventListener('mousedown', Resize.drag, true);
		//add listeners
		document.addEventListener('mousemove', Resize.resize, false);
		document.addEventListener('mouseup', Resize.drop, true);
		//stop event
		event.preventDefault();
		event.stopPropagation();
	},

	drop : function() {
		//remove listeners
		document.removeEventListener('mousemove', Resize.resize, false);
		document.removeEventListener('mouseup', Resize.drop, true);
		document.body.style.cursor = 'default';
		//add listeners
		Resize.currentResize.style.cursor = 'default';
		Resize.currentResize.addEventListener('mousemove', Resize.monitor, false);
	},

	resize : function(event) {
		switch(Resize.way) {
			case('horizontal') : {
				var largeur = event.clientX - Resize.currentResize.offsetLeft;
				if(largeur > Resize.minWidth) {
					Resize.currentResize.style.width = largeur + 'px';
				}
				break;
			}
			case('vertical') : {
				var hauteur = event.clientY - Resize.currentResize.offsetTop;
				if(hauteur > Resize.minHeight) {
					Resize.currentResize.style.height = hauteur + 'px';
				}
				break;
			}
			case('diagonal') : {
				var largeur = event.clientX - Resize.currentResize.offsetLeft;
				var hauteur = event.clientY - Resize.currentResize.offsetTop;
				if(largeur > Resize.minWidth && hauteur > Resize.minHeight) {
					Resize.currentResize.style.width = largeur + 'px';
					Resize.currentResize.style.height = hauteur + 'px';
					}
				break;
			}
		}
		//stop event
		event.preventDefault();
		event.stopPropagation();
	}
}