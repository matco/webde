/*
Ce script s'apparente a une classe mais ne peut etre definit comme tel dans le code sous peine de compliquer inutilement la gestion des evenements.
Il peut etre considere comme une bibliotheque.
Ceci implique l'utilisation de variables d'environnement qui doivent etre reserves a ce script (a priori).

************Script Classement********** 
*****Definition*****
classement.script.js classement.script.js permet le classement par glisse depose d'une serie de noeud ayant le meme parent a partir d'un de ses fils. Le classement se fait a l'horizontal.

*****Utilisation*****
L'ecouteur suivant doivent etre ajoutes :
noeud.addEventListener('mousedown',classeDemarre,true);
D'autres ecouteurs sont ajoutes automatiquement par le script lui meme.
Deux methodes sont prototypes sur les objets elements.

*****Fonctions*****
classeDemarre : prepare un noeud au classement
	emplacement : noeud
classe : permet le deplacement du noeud en question
	emplacement : document
classeArrete : relache le noeud
	emplacement : noeud
*/

//variables d'environnement
var enclassement = false; //variable contenant le noeud en cours de classement

//ajout de methodes aux noeud
HTMLElement.prototype.noeudSuivant = function() {
	var noeud = this.nextSibling;
	while(noeud) {
		if(noeud.nodeType != 3 && noeud.nodeType != 8) {
			return noeud;
		}
		noeud = noeud.nextSibling;
	}
	return null;
}

HTMLElement.prototype.noeudPrecedent = function() {
	var noeud = this.previousSibling;
	while(noeud) {
		if(noeud.nodeType != 3 && noeud.nodeType != 8) {
			return noeud;
		}
		noeud = previousSibling;
	}
	return null;
}

function classeDemarre(evenement) {
	enclassement = this;
	//ajout des ecouteurs
	enclassement.addEventListener('mouseup',classeArrete,true);
	document.addEventListener('mousemove',classe,true);
	//arret de l'evenement
	evenement.preventDefault();
	evenement.stopPropagation();
}

function classe(evenement) {
	var suivant = enclassement.noeudSuivant() || false;
	var precedent = enclassement.noeudPrecedent() || false;
	var parent = enclassement.parentNode;
	if(suivant && evenement.clientX > (suivant.offsetLeft + suivant.offsetWidth / 4)) {
		var noeud = parent.replaceChild(enclassement,suivant);
		parent.insertBefore(noeud,enclassement);
		noeud.addEventListener('mousedown',classeDemarre,true);
	}
	if(precedent && evenement.clientX < (precedent.offsetLeft + precedent.offsetWidth / 4)) {
		var noeud = parent.replaceChild(precedent,enclassement);
		parent.insertBefore(noeud,precedent);
		noeud.addEventListener('mousedown',classeDemarre,true);
	}
	evenement.preventDefault();
	evenement.stopPropagation();
}

function classeArrete(evenement) {
	//suppresion des ecouteurs
	document.removeEventListener('mousemove',classe,true);
	this.addEventListener('mouseup',classeArrete,true);
	enclassement = false;
	evenement.preventDefault();
	evenement.stopPropagation();
}