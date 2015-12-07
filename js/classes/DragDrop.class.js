'use strict';
/*
************DragDrop**********

*****Reminder*****
This is an object, not a class. This is a singleton. Only one "instance" of this object is allowed at the same time.
This object use "DragDrop" as a namespace. Please do not use any other script with the same namespace to avoid conflicts.

*****Definition*****
DragDrop allows to drag and drop any node of a html document.

*****Usage*****
DragDrop.add(node);
node is the handle, node's parent will be drag and droppable

*****Methods*****
start: prepare a node to be draggable and memorize offset between the position of the element and the position of the mouse
move: move current dragged node
stop: disable node
*/

var DragDrop = {

	//variables d'environnement
	xOffset : 0, //ecart entre la position du node et la position de la souris lors de la saisie sur l'abscisse
	yOffset : 0, //ecart entre la position du node et la position de la souris lors de la saisie sur l'ordonnee
	currentDragged : null, //variable contenant le node en cours de deplacement

	add : function(node) {
		node.addEventListener('mousedown', DragDrop.drag, false);
	},

	remove : function(node) {
		node.removeEventListener('mousedown', DragDrop.drag, false);
	},

	drag : function(event) {
		var node = this.parentNode;
		//recuperation de la position de la prise sur l'objet
		DragDrop.xOffset = event.clientX - node.offsetLeft;
		DragDrop.yOffset = event.clientY - node.offsetTop;
		//keep a link to dragged node
		DragDrop.currentDragged = node;
		//add listeners
		DragDrop.currentDragged.addEventListener('mouseup', DragDrop.drop, false);
		document.addEventListener('mousemove', DragDrop.move, false);
		//stop event
		event.preventDefault();
		event.stopPropagation();
	},

	move : function(event) {
		DragDrop.currentDragged.style.cursor = 'move';
		DragDrop.currentDragged.style.opacity = 0.8;
		DragDrop.currentDragged.style.left = event.clientX - DragDrop.xOffset + 'px';
		DragDrop.currentDragged.style.top = event.clientY - DragDrop.yOffset + 'px';
		//stop event
		event.preventDefault();
		event.stopPropagation();
	},

	drop : function(event) {
		DragDrop.currentDragged.style.cursor = 'default';
		DragDrop.currentDragged.style.opacity = 1;
		//delete listeners
		document.removeEventListener('mousemove', DragDrop.move, false);
		DragDrop.currentDragged.removeEventListener('mouseup', DragDrop.drop, true);
		//stop event
		event.preventDefault();
		event.stopPropagation();
	}
}