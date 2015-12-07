'use strict';

var DateTime = {

	displayTime : function(node) {
		var date = new Date;
		var hour = (date.getHours() < 10) ?  '0' + date.getHours() : date.getHours();
		var minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
		var seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
		//write time on node
		node.textContent = hour + ':' + minutes + ':' + seconds + '.';
		//call function again in one second
		setTimeout(function() {DateTime.displayTime(node)}, 1000);
	},

	displayDate : function(node, language) {
		var date = new Date;
		var day;
		var month;
		var text;
		if(language === 'fr') {
			switch(date.getDay()) {
				case(0) : day = 'Dimanche'; break;
				case(1) : day = 'Lundi'; break;
				case(2) : day = 'Mardi'; break;
				case(3) : day = 'Mercredi'; break;
				case(4) : day = 'Jeudi'; break;
				case(5) : day = 'Vendredi'; break;
				case(6) : day = 'Samedi'; break;
			}
			switch(date.getMonth()) {
				case(0) : month = 'janvier'; break;
				case(1) : month = 'fevrier'; break;
				case(2) : month = 'mars'; break;
				case(3) : month = 'avril'; break;
				case(4) : month = 'mai'; break;
				case(5) : month = 'juin'; break;
				case(6) : month = 'juillet'; break;
				case(7) : month = 'août'; break;
				case(8) : month = 'septembre'; break;
				case(9) : month = 'octobre'; break;
				case(10) : month = 'novembre'; break;
				case(11) : month = 'decembre'; break;
			}
			text = day + ' ' + date.getDate() + ' ' + month + ' ' + date.getFullYear();
		}
		if(language === 'en') {
			switch(date.getDay()) {
				case(0) : day = 'Sunday'; break;
				case(1) : day = 'Monday'; break;
				case(2) : day = 'Thuesday'; break;
				case(3) : day = 'Wednesday'; break;
				case(4) : day = 'Thursday'; break;
				case(5) : day = 'Friday'; break;
				case(6) : day = 'Saturday'; break;
			}
			switch(date.getMonth()) {
				case(0) : month = 'January'; break;
				case(1) : month = 'February'; break;
				case(2) : month = 'March'; break;
				case(3) : month = 'April'; break;
				case(4) : month = 'May'; break;
				case(5) : month = 'June'; break;
				case(6) : month = 'July'; break;
				case(7) : month = 'August'; break;
				case(8) : month = 'September'; break;
				case(9) : month = 'October'; break;
				case(10) : month = 'November'; break;
				case(11) : month = 'December'; break;
			}
			text = day + ', ' + month + ' ' + date.getDate() + 'th, ' + date.getFullYear();
		}
		node.textContent = text;
	}
}

