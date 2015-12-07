'use strict';

var Modal = {
	overlay : undefined,
	modal : undefined,

	showOverlay : function() {
		Modal.overlay = document.createElement('div');
		Modal.overlay.style.opacity = 0.8;
		Modal.overlay.style.width = '100%';
		Modal.overlay.style.height = '100%';
		Modal.overlay.style.position = 'fixed';
		Modal.overlay.style.top = 0;
		Modal.overlay.style.left = 0;
		Modal.overlay.style.zIndex = 1000;
		Modal.overlay.style.backgroundColor = 'black';
		document.body.appendChild(Modal.overlay);
	},

	hideOverlay : function() {
		document.body.removeChild(Modal.overlay);
	},

	manageEscape : function(event) {
		//close modal if escape key is pressed
		if(event.keyCode == 27) {
			Modal.close();
		}
	},

	manageOutsideClick : function(event) {
		//close modal if this click occured outside
		if(!Modal.modal.contains(event.target)) {
			Modal.close();
		}
	},

	prepareClose : function(element) {
		element.addEventListener(
			'click',
			function(event) {
				event.stopPropagation();
				event.preventDefault();
				Modal.close();
			}
		);
	},

	prepare : function(element) {
		element.removeEventListener('click', Modal.open);
		element.addEventListener('click', Modal.open);
	},

	open : function(event) {
		var link = this.getAttribute('href');
		//modal window is already here, hidden in the page
		if(link.indexOf('#') !== -1) {
			link = link.substring(link.indexOf('#') + 1, link.length);
			Modal.show(document.getElementById(link));
		}
		//modal content must be loaded from network
		else {
			//add timestamp parameter to be sure the browser won't use its cache
			link += link.indexOf('?') != -1 ? '&' : '?';
			link = link + 'ts=' + Math.floor(Math.random() * 1000001);
			//retrieve data
			var xhr = new XMLHttpRequest();
			xhr.addEventListener('load', function(event) {
				if(xhr.readyState == 4) {
					if(xhr.status == 200) {
						var xml = xhr.responseXML;
						var modal = document.createElement('div');
						//add content from xhr
						for(var i = 0; i < xml.childNodes.length; i++) {
							if(xml.childNodes[i].nodeType == '1' || xml.childNodes[i].nodeType == '3') {
								modal.appendChild(document.importNode(xml.childNodes[i], true));
							}
						}
						//add close button
						var close = document.createElement('a');
						close.addEventListener('click', function() {
							document.body.removeChild(Modal.modal);
							Modal.close()
						}, true);
						close.textContent = 'Close';
						close.className = 'button';
						close.style.cssFloat = 'right';
						close.style.margin = '10px';
						close.style.display = 'block';
						modal.appendChild(close);
						//add modal
						document.body.appendChild(modal);
						Modal.show(modal);
					}
				}
			});
			xhr.open('GET', anchor.href, true);
			xhr.send();
		}
		event.stopPropagation();
		event.preventDefault();
	},

	show : function(element) {
		//check if there is already an open modal
		if(Modal.modal) {
			return;
		}
		Modal.showOverlay();
		Modal.modal = element;
		Modal.modal.style.position = 'fixed';
		Modal.modal.style.display = 'block';
		Modal.modal.style.top = 'calc(45% - ' + (Modal.modal.offsetHeight / 2) + 'px)';
		Modal.modal.style.left = 'calc(50% - ' + (Modal.modal.offsetWidth / 2) + 'px)';
		Modal.modal.style.zIndex = 1001;
		Modal.modal.style.opacity = 1;
		document.addEventListener('keypress', Modal.manageEscape);
		document.addEventListener('click', Modal.manageOutsideClick);
	},

	close : function() {
		document.removeEventListener('click', Modal.manageOutsideClick);
		document.removeEventListener('keypress', Modal.manageEscape);
		Modal.modal.style.display = 'none';
		Modal.modal = undefined;
		Modal.hideOverlay();
	}
};
