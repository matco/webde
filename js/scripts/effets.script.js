function retrecissement(idnoeud,identete,hauteur,pas,duree) {
	noeud = document.getElementById(idnoeud);
	//initialisation
	if(!noeud.style.height || noeud.style.height == '') {
		document.getElementById(identete).className = 'chargement';
		noeud.style.height = hauteur + 'px';
		setTimeout('retrecissement(\'' + idnoeud + '\',\'' + identete + '\',' + hauteur + ',' + pas + ',' + duree + ')',duree);
	}
	//retrecissement
	else if(parseFloat(noeud.style.height) > pas) {
		noeud.style.height = (parseFloat(noeud.style.height) - pas) + 'px';
		setTimeout('retrecissement(\'' + idnoeud + '\',\'' + identete + '\',' + hauteur + ',' + pas + ',' + duree + ')',duree);
	}
	//finalisation
	else {
		noeud.style.height = '0';
		noeud.style.display = 'none';
		document.getElementById(identete).className = 'depli';
	}
}

function aggrandissement(idnoeud,identete,hauteur,pas,duree) {
	noeud = document.getElementById(idnoeud);
	//initialisation
	document.getElementById(identete).className = 'chargement';
	noeud.style.display = 'block';
	//aggrandissement
	if(parseFloat(noeud.style.height) < (hauteur - pas)) {
		noeud.style.height = (parseFloat(noeud.style.height) + pas) + 'px';
		setTimeout('aggrandissement(\'' + idnoeud + '\',\'' + identete + '\',' + hauteur + ',' + duree + ')',duree);
	}
	//finalisation
	else {
		noeud.style.height = hauteur + 'px';
		noeud.style.height = '';
		document.getElementById(identete).className = 'repli';
	}
}

function disparition(idnoeud,pas,duree) {
	noeud = document.getElementById(idnoeud);
	//initialisation
	if(!noeud.style.opacity || noeud.style.opacity == 1) {
		noeud.style.opacity = 0.9;
		setTimeout('disparition(\'' + idnoeud + '\',' + pas + ',' + duree + ')',duree);
	}
	//disparition
	else if(noeud.style.opacity > 0) {
		noeud.style.opacity = (parseFloat(noeud.style.opacity) - pas);
		setTimeout('disparition(\'' + idnoeud + '\',' + pas + ',' + duree + ')',duree);
	}
	//finalisation
	else {
		noeud.style.display = 'none';
	}
}

function apparition(idnoeud,pas,duree) {
	noeud = document.getElementById(idnoeud);
	//initialisation
	if(!noeud.style.opacity || noeud.style.opacity == 0) {
		noeud.style.opacity = 0.1;
		noeud.style.display = 'block';
		setTimeout('apparition(\'' + idnoeud + '\',' + pas + ',' + duree + ')',duree);
	}
	//apparition
	else if(parseFloat(noeud.style.opacity) < 1) {
		noeud.style.opacity = (parseFloat(noeud.style.opacity) + pas);
		setTimeout('apparition(\'' + idnoeud + '\',' + pas + ',' + duree + ')',duree);
	}
}