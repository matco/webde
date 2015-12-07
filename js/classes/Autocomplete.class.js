'use strict';
/*
************Autocomplete**********

*****Definition*****
Autocomplete allows to manage autocompletion in a form field

*****Usage*****
Create Autocomplete with following required parameters
field: field to autocomplete
datalist: list that will contain list of available choices for the user
update: function used to update list of choices
action : callback to execute when form is validated, selected html element will be provided as a parameter

******Methods*****
startMonitoring: start monitoring the field, executing method "monitore" multiple times per second
stopMonitoring: stop monitoring the field and stop executing method "monitore"
monitore: scan field content and update list of choices if content of the field has been updated
cleanDatalist: clear list of choices
select: highlight user choice by adding class "selection" to it
manageKeyboard: manage selection with keyboards arrows and validation with the "enter" key
*/

function Autocomplete(parameters) {
	/*parameters*/
	this.field; //field to autocomplete
	this.datalist; //list of available choices
	this.update; //function used to update datalist called when input is modified
	this.action; //callback after selection

	//bind parameters
	for(var parameter in parameters) {
		this[parameter] = parameters[parameter];
	}

	var that = this;

	/*internal variables*/
	this.oldValue;
	this.newValue;
	this.selection = 0; //current selection
	this.monitoringInterval; //monitoring interval reference

	//add listeners
	this.field.addEventListener('focus', function(event) {that.startMonitoring(event);}, false);
	this.field.addEventListener('blur', function(event) {that.stopMonitoring(event);}, false);
	this.field.addEventListener('keydown', function(event) {that.manageKeyboard(event);}, false);
	//Autocomplete.liste.style.width = Autocomplete.champ.offsetWidth + 'px';
	//Autocomplete.liste.style.whiteSpace = 'nowrap';
}

Autocomplete.prototype.startMonitoring = function() {
	var that = this;
	this.field.value = '';
	this.monitoringInterval = window.setInterval(function() {that.monitore();}, 500);
};

Autocomplete.prototype.stopMonitoring = function() {
	var that = this;
	window.clearInterval(this.monitoringInterval);
	this.field.value = '';
	this.cleanDatalist();
	this.datalist.style.display = 'none';
};

Autocomplete.prototype.cleanDatalist = function() {
	while(this.datalist.hasChildNodes()) {
		this.datalist.removeChild(this.datalist.firstChild);
	}
};

Autocomplete.prototype.monitore = function() {
	this.newValue = this.field.value;
	if(this.newValue === '') {
		this.oldValue = this.newValue;
		this.cleanDatalist();
	}
	if(this.newValue !== this.oldValue) {
		this.oldValue = this.newValue;
		this.cleanDatalist();
		//getting results from provided function
		var results = this.update(this.newValue);
		for(var i = 0; i < results.length; i++) {
			//append result
			this.datalist.appendChild(results[i]);
			results[i].className = i == 0 ? 'selection' : '';
			var that = this;
			//add listeners
			results[i].addEventListener(
				'mousedown',
				function(event) {
					that.action(event.currentTarget);
				},
				false
			);
			results[i].addEventListener(
				'mousemove',
				function(event) {
					for(var i = 0; i < that.datalist.childNodes.length; i++) {
						if(that.datalist.childNodes[i] == event.currentTarget) {
							that.selection = i;
							break;
						}
					}
					that.select(that.selection);
				},
				false
			);
		}
	}
	this.datalist.style.display = this.datalist.hasChildNodes() ? 'block' : 'none';
};

Autocomplete.prototype.select = function(selection) {
	for(var i = 0; i < this.datalist.childNodes.length; i++) {
		this.datalist.childNodes[i].className = i == selection ? 'selection' : '';
	}
};

Autocomplete.prototype.manageKeyboard = function(event) {
	if(this.datalist.childNodes.length !== 0) {
		//cas de l'appui sur entree
		if(event.which == 13) {
			this.action(this.datalist.childNodes[this.selection]);
			this.stopMonitoring();
		}
		//cas de l'appui sur la touche du bas
		if(event.which == 40) {
			//cas ou l'on est tout en bas
			if(this.selection == (this.datalist.childNodes.length - 1)) {
				this.selection = 0;
				this.select(this.selection);
			}
			//cas normal
			else {
				this.selection++;
				this.select(this.selection);
			}
		}
		//cas de l'appui sur la touche du haut
		if(event.which == 38) {
			//cas ou l'on est tout en haut
			if (this.selection == 0) {
				this.selection = this.datalist.childNodes.length - 1;
				this.select(this.selection);
			}
			//cas normal
			else {
				this.selection--;
				this.select(this.selection);
			}
		}
	}
};
