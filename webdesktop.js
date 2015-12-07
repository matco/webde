'use strict'

//environment variables
var Config = {
	username : null,
	screenSaverDelay : 30,
	save : function() {
		localStorage.config = JSON.stringify(this);
	},
	load : function() {
		if(localStorage.config) {
			var savedConfig = JSON.parse(localStorage.config);
			for(var option in savedConfig) {
				this[option] = savedConfig[option];
			}
		}
	},
	remove : function() {
		delete localStorage.config;
	}
};

window.addEventListener('load', init, false);

function initApps() {
	window.apps = [];
	//retrieve app list with synchronous xhr request
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'webdesktop.xml', false);
	xhr.send();
	var xml = xhr.responseXML;
	var nodes = xml.evaluate('/space/apps/app', xml, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	var node = nodes.iterateNext();
	while(node) {
		var app = document.getElementById(node.getAttribute('id'));
		apps.push(app);
		//setting properties
		//app.title = node.getElementsByTagName('title')[0].textContent;
		//app.icon = node.getElementsByTagName('icon')[0].textContent;
		if(node.getElementsByTagName('resizable')[0]) {
			app.resizable = node.getElementsByTagName('resizable')[0].textContent == 'true';
		}
		if(node.getElementsByTagName('source')[0]) {
			app.source = node.getElementsByTagName('source')[0].textContent;
		}
		initApp(app);
		node = nodes.iterateNext();
	}
}

function initApp(element) {
	element.ui = {};
	element.ui.title = element.childNodes[0]; 
	element.ui.content = element.childNodes[1];
	var icons = element.ui.title.querySelectorAll('img');
	var i = 0;
	element.ui.icon = icons.item(i++);
	element.ui.close = icons.item(i++);
	element.ui.minimize = icons.item(i++);
	element.ui.fold = icons.item(i++);
	element.ui.loading = icons.item(i++);

	element.winkle = function(number) {
		if(number >= 0) {
			this.style.opacity = (number % 2) ? 0.5 : 1;
			setTimeout((function(self) {return function() {self.winkle(--number)}})(this), 50);
		}
	}
	element.startLoading = function() {this.ui.loading.style.display = 'block';}
	element.stopLoading = function() {this.ui.loading.style.display = 'none';}
	element.minimize = function() {
		this.minimized = true;
		this.oldLeft = this.style.left;
		this.oldTop = this.style.top;
		this.style.display = 'none';
		//add tooltip
		Tooltip.addTooltip(this.ui.glimpse, this);
	}
	element.maximize = function() {
		//remove tooltip
		Tooltip.remove(this.ui.glimpse);
		this.minimized = false;
		this.style.left = this.oldLeft;
		this.style.top = this.oldTop;
		this.style.display = 'block';
	}
	element.focus = function() {
		this.className = 'window active';
		this.style.boxShadow = '2px 2px 15px #7195c1';
		for(var i = 0; i < apps.length; i++) {
			if(apps[i].id !== this.id) {
				apps[i].className = 'window';
				apps[i].style.boxShadow = '';
			}
		}
	}
	element.open = function() {
		if(!this.opened) {
			this.opened = true;
			this.minimized = false;
			if(this.source) {
				this.startLoading();
				var that = this;
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if(xhr.readyState == 4 && xhr.status == 200) {
						var content = document.importNode(xhr.responseXML.documentElement, true);
						while(content.hasChildNodes()) {
							if(content.firstChild.localName == 'script') {
								if(content.firstChild.hasAttribute('src')) {
									var script = document.createElement('script');
									script.src = content.firstChild.src;
									document.getElementsByTagName('head')[0].appendChild(script);
								}
								else {
									var script = document.createElement('script');
									script.textContent = content.firstChild.textContent;
									//document.getElementsByTagName('head')[0].appendChild(script);
									that.ui.content.appendChild(script);
								}
								content.removeChild(content.firstChild);
							}
							else {
								that.ui.content.appendChild(content.firstChild);
							}
						}
						/*var results = that.ui.content.querySelectorAll('script[type="text/javascript"]');
						for(var i = 0; i < results.length; i++) {
							if(results[i].textContent != '') {
								alert(results[i].textContent);
								eval(results[i].textContent);
							}
						}*/
						//that.ui.content.innerHTML = xhr.responseText;
						/*document.getElementById(id + '-content').innerHTML = resultat;
						if(document.getElementById('script') && document.getElementById('script').parentNode.id == id + '-content') {
							eval(document.getElementById('script').textContent);
						}*/
						that.stopLoading();
					}
				}

				xhr.open('GET', 'apps/' + this.id + '/' + this.source + '?timestamp=' + new Date().getTime());
				xhr.send();
			}
			//add listeners to manage resizing and focus
			if(this.resizable) {
				Resize.add(this);
			}
			//ui properties
			this.style.display = 'block';
			//add listener to manage focus
			this.addEventListener('mousedown', function(event) {this.focus()}, true);
			//add listeners to manage movement and folding
			DragDrop.add(this.ui.title);
			this.ui.title.addEventListener('dblclick', function(event) {this.parentNode.toggleFold()}, false);
			//add listeners on control buttons
			this.ui.close.addEventListener('click', function(event) {this.parentNode.parentNode.close()}, true);
			this.ui.fold.addEventListener('click', function(event) {this.parentNode.parentNode.toggleFold()}, true);
			this.ui.minimize.addEventListener('click', function(event) {this.parentNode.parentNode.minimize()}, true);
			//insert in taskbar
			document.getElementById('taskbar').createIcon(this);
		}
		else if(this.minimized) {
			this.maximize();
		}
		else {
			this.winkle(3);
		}
		this.focus();
		//close menu
		document.getElementById('menubar').closeMenus();
	}
	element.close = function() {
		this.opened = false;
		//ui properties
		this.style.display = 'none';
		//remove listeners to manage resizing and focus
		this.removeEventListener('mousedown', focus, true);
		if(this.resizable) {
			Resize.remove(this);
		}
		//remove listeners to manage movement and folding
		DragDrop.remove(this.ui.title);
		this.ui.title.removeEventListener('dblclick', this.toggleFold, false);
		//remove listeners on control buttons
		this.ui.close.removeEventListener('click', this.close, true);
		this.ui.fold.removeEventListener('click', this.fold, true);
		this.ui.minimize.removeEventListener('click', this.minimize, true);
		//delete in taskbar
		document.getElementById('taskbar').deleteIcon(this);
		//delete content
		while(this.ui.content.hasChildNodes()) {
			this.ui.content.removeChild(this.ui.content.firstChild);
		}
	}
	element.toggleFold = function() {
		if(this.ui.content.style.display == 'none') {
			this.unfold();
		}
		else {
			this.fold();
		}
	}
	element.unfold = function() {
		Resize.add(this);
		this.style.height = this.oldHeight;
		this.ui.content.style.display = 'block';
		this.ui.fold.src = 'design/images/fold.png';
	}
	element.fold = function() {
		this.oldHeight = this.style.height;
		Resize.remove(this);
		this.style.height = '';
		this.ui.content.style.display = 'none';
		this.ui.fold.src = 'design/images/unfold.png';
	}
}

function initTaskbar() {
	//taskbar management
	var taskbar = document.getElementById('taskbar');
	taskbar.ui = {};
	taskbar.ui.minimizeAll = document.getElementById('minimize-all');
	taskbar.ui.minimizeAll.taskbar = taskbar;
	taskbar.ui.minimizeAll.addEventListener('click', function(event) {event.currentTarget.taskbar.minimizeAll()}, false);
	document.getElementById('minimize-all');
	taskbar.createIcon = function(app) {
		//create title bar
		var text = document.createTextNode(app.ui.title.textContent);
		var title = document.createElement('span');
		title.appendChild(text);
		//group the two items
		var glimpse = document.createElement('li');
		glimpse.appendChild(title);
		//link application and glimpse
		app.ui.glimpse = glimpse;
		glimpse.app = app;
		//add listeners
		glimpse.addEventListener('click', function(event) {this.app.minimized ? this.app.maximize() : this.app.minimize()}, false);
		//insert in taskbar
		this.appendChild(glimpse);
	}
	taskbar.deleteIcon = function(app) {
		//remove listeners (TODO Memory Leak)
		//app.glimpse.removeEventListener('click', ..., true);
		//remove in taskbar
		this.removeChild(app.ui.glimpse);
	}
	taskbar.minimizeAll = function() {
		for(var i = 0; i < apps.length; i++) {
			if(apps[i].opened) {
				apps[i].minimize();
			}
		}
	}
}

function initMenubar() {
	var menubar = document.getElementById('menubar');
	menubar.menus = [];
	//initialize each menu
	var menus = menubar.querySelectorAll('*[menu]');
	for(var i = 0; i < menus.length; i++) {
		menubar.menus.push(menus[i]);
		menus[i].menubar = menubar;
		initMenu(menus[i]);
	}
	menubar.unblockMenus = function(sourceMenu) {
		for(var i = 0; i < this.menus.length; i++) {
			if(this.menus[i] !== sourceMenu) {
				this.menus[i].blocked = false;
			}
		}
	}
	menubar.closeMenus = function() {
		for(var i = 0; i < this.menus.length; i++) {
			this.menus[i].close();
		}
	}
}

function initMenu(menu) {
	//initialize each menu item
	var items = menu.querySelectorAll('*[link]');
	for(var i = 0; i < items.length; i++) {
		items[i].target = document.getElementById(items[i].getAttribute('link'));
		items[i].menubar = menu.menubar;
		items[i].addEventListener('click', function(event) {
			event.currentTarget.menubar.closeMenus();
			event.currentTarget.target.open();
			event.stopPropagation();
			event.preventDefault();
		}, true);
	}
	menu.blocked = true;
	menu.content = document.getElementById(menu.getAttribute('menu'));
	menu.close = function() {
		this.blocked = true;
		this.style.backgroundColor = '';
		this.content.style.display = 'none';
	}
	menu.open = function(event) {
		if(event.type == 'click' || !this.blocked) {
			this.menubar.closeMenus();
			this.menubar.unblockMenus(this);
			this.style.backgroundColor = '#7195c1';
			this.content.style.display = 'block';
		}
		event.preventDefault();
		event.stopPropagation();
	}

	menu.addEventListener('click', function(event) {event.currentTarget.open(event)}, false);
	menu.addEventListener('mousemove', function(event) {event.currentTarget.open(event)}, false);
}

function initOptions() {
	document.getElementById('options-form')['timer'].value = Config.screenSaverDelay;
	document.getElementById('options-menu').addEventListener('click', function(event) {
		Modal.show(document.getElementById('options'));
		event.stopPropagation();
	}, true);
	document.getElementById('options-close').addEventListener('click', function() {
		Modal.close();
	}, true);
	document.getElementById('options-cancel').addEventListener('click', function(event) {
		Modal.close();
		Notification.notify('Options canceled');
	}, true);
	document.getElementById('options-form').addEventListener('submit', function(event) {
		ScreenSaver.delay = event.currentTarget['timer'].value * 60;
		Config.screenSaverDelay = event.currentTarget['timer'].value;
		Config.save();
		Modal.close();
		event.preventDefault();
		Notification.notify('Options saved');
	}, true);

	//build slider
	new Slider({
		min : 5,
		max : 60,
		magnet : 5,
		place : document.getElementById('timer-slider'),
		input : document.getElementById('options-form')['timer'],
		barBackgroundColor : '#7195c1',
		barWidth : 300,
		barHeight : 10,
		cursorBackgroundColor : '#2E506A',
		cursorWidth : 7,
		cursorHeight : 15,
		grading: true
	});
}

function initLogin() {
	//login
	document.getElementById('login-form').addEventListener('submit', function(event) {
		var username = document.getElementById('login-form')['username'];
		if(username.value == '') {
			username.className = 'error';
			document.getElementById('login-error').textContent = 'Username is required!';
		}
		else {
			username.className = '';
			document.getElementById('login-error').textContent = '';
			Config.username = username.value;
			Config.save();
			displayUsername();
			Modal.close('login');
			Notification.notify('Welcome ' + Config.username);
		}
		event.preventDefault();
		event.stopPropagation();
	}, false);
	//logout
	document.getElementById('logout').addEventListener('click', function(event) {
		event.stopPropagation();
		Config.remove();
		displayUsername();
		Modal.show(document.getElementById('login'));
		Notification.notify('Logout successful');
	}, false);
}

//parameters and listeners initialization function
function init() {
	//loading script
	document.body.style.opacity = 0.2;
	document.getElementById('loading').style.opacity = 1;

	//load config
	Config.load();

	initApps();
	initMenubar();
	initTaskbar();

	//search field
	new Autocomplete({
		field : document.getElementById('search'),
		datalist : document.getElementById('search-results'),
		update : search,
		action : function(element) {document.getElementById(element.getAttribute('link')).open()},
	});

	//options menu
	initOptions();
	initLogin();

	//time
	DateTime.displayTime(document.getElementById('time'));
	DateTime.displayDate(document.getElementById('date'), 'en');

	//environment functions
	displayTitle();
	displayUsername();
	//display domain
	document.getElementById('title').textContent = document.domain;

	//add listeners on window
	window.addEventListener('resize', displayTitle, false);
	window.addEventListener('click', contextualMenu, false);
	window.addEventListener('click', function() {document.getElementById('menubar').closeMenus()}, false);

	//screensaver
	ScreenSaver.init({
		delay : Config.screenSaverDelay * 60
	});

	//notifications
	Notification.time = 5000;

	//end of loading script
	document.getElementById('loading').style.display = 'none';
	document.body.style.opacity = 1;

	//login script
	if(!Config.username || Config.username == '') {
		Modal.show(document.getElementById('login'));
	}
	else {
		Notification.notify('Welcome ' + Config.username);
	}
}

function displayUsername() {
	document.getElementById('user').textContent = Config.username;
}

function displayTitle() {
	var space = 100 - Math.round((window.screen.width * window.screen.height - window.innerWidth * window.innerHeight) / (window.screen.width * window.screen.height * 0.01));
	document.getElementById('title-infos').textContent = window.innerWidth + 'x' + window.innerHeight + ' (' + space + '% of the screen) - ' + window.navigator.appName + ' ' + window.navigator.appVersion;
}

function contextualMenu(event) {
	if(event.button == 2) {
		//cleaning old content
		var menu = document.getElementById('contextual-list');
		while(menu.childNodes.length > 0) {
			menu.removeChild(menu.firstChild);
		}
		for(var i = 0; i < apps.length; i++) {
			if(!apps[i].opened) {
				var element = document.createElement('li');
				element.app = apps[i];
				var text = document.createTextNode(apps[i].ui.title.textContent);
				element.appendChild(text);
				element.setAttribute('link', apps[i].id);
				element.addEventListener('click', function(event) {this.app.open()}, true);
				menu.appendChild(element);
			}
		}
		menu.style.display = 'block';
		apparition('contextual', 0.1, 10);
		menu.parentNode.style.left = event.clientX + 'px';
		menu.parentNode.style.top = event.clientY + 'px';
		menu.parentNode.style.zIndex = 500;
		event.preventDefault();
	}
	else {
		disparition('contextual', 0.1, 10);
	}
}

function search(name) {
	var results = [];
	//adding new results
	var regexp = new RegExp('(.*)' + name + '(.*)','i');
	for(var i = 0; i < apps.length; i++) {
		//alert(window + ' - ' + regexp.test(w));
		if(regexp.test(apps[i].id)) {
			var element = document.createElement('li');
			element.setAttribute('link', apps[i].id);
			element.target = document.getElementById(apps[i].id);
			var image = document.createElement('img');
			image.setAttribute('src', apps[i].ui.icon.src);
			image.setAttribute('style', 'padding: 5px;');
			element.appendChild(image);
			var text = document.createTextNode(apps[i].ui.title.textContent);
			element.appendChild(text);
			results.push(element);
		}
	}
	return results;
}
