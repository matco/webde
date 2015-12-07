'use strict';

var Tooltip = {
	init : function() {
		Tooltip.initNode(document);
	},

	initNode : function(node) {
		//add listeners on all nodes wich have a tooltip attribute
		var nodes = node.querySelectorAll('*[tooltip]');
		for(var i = 0; i < nodes.length; i++) {
			Tooltip.add(nodes[i]);
		}
	},

	add : function(node) {
		Tooltip.addTooltip(node, document.getElementById(node.getAttribute('tooltip')));
	},

	addTooltip : function(node, tooltip) {
		if(!tooltip.hasAttribute('id')) {
			tooltip.id = new Date().getTime();
		}
		tooltip.style.position = 'fixed';
		tooltip.style.zIndex = 1001;
		tooltip.style.display = 'none';
		node.setAttribute('tooltip', tooltip.id);
		node.addEventListener('mousemove', Tooltip.show, true);
		node.addEventListener('mouseout', Tooltip.hide, true);
	},

	remove : function(node) {
		node.removeEventListener('mousemove', Tooltip.show, true);
		node.removeEventListener('mouseout', Tooltip.hide, true);
		var tooltip = document.getElementById(node.getAttribute('tooltip'));
		tooltip.style.display = '';
		tooltip.style.zIndex = '';
		tooltip.style.position = '';
	},

	show : function(event) { 
		var xaxis = event.clientX + 15;
		var yaxis = event.clientY + 15;
		var tooltip = document.getElementById(this.getAttribute('tooltip'));
		//update tooltip position if it is outside the window
		if((xaxis + tooltip.offsetWidth) >= document.body.offsetWidth) {
			xaxis = event.clientX - tooltip.offsetWidth - 30;
		}
		if((yaxis + tooltip.offsetHeight) >= document.body.offsetHeight) {
			yaxis = event.clientY - tooltip.offsetHeight - 30;
		}
		tooltip.style.left = xaxis + 'px';
		tooltip.style.top = yaxis + 'px';
		tooltip.style.display = 'block';
	},

	hide : function(event) {
		document.getElementById(this.getAttribute('tooltip')).style.display = 'none';
	}
};

//auto add tooltip on nodes which have a tooltip attribute
window.addEventListener('load', Tooltip.init, false);