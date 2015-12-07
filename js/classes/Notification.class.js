'use strict';

var Notification = {
	hideTimeout : null,
	hidingTimeout : null,
	time : 8000,
	notify : function(message) {
		var notification = document.getElementById('notification');
		if(notification) {
			Notification.clearTimeouts();
		}
		else {
			notification = document.createElement('div');
			document.body.appendChild(notification);
			notification.id = 'notification';
		}
		notification.textContent = message;
		notification.style.opacity = 1;
		notification.style.display = 'block';
		Notification.hideTimeout = setTimeout(Notification.hide, Notification.time);
	},
	hide : function() {
		var notification = document.getElementById('notification');
		if(notification.style.opacity > 0) {
			notification.style.opacity = notification.style.opacity - 0.02;
			Notification.hidingTimeout = setTimeout(Notification.hide, 50);
		}
		else {
			notification.style.display = 'none';
			document.body.removeChild(notification);
		}
	},
	clearTimeouts : function() {
		if(Notification.hideTimeout) {
			clearTimeout(Notification.hideTimeout);
		}
		if(Notification.hidingTimeout) {
			clearTimeout(Notification.hidingTimeout);
		}
	}
}