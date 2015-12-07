/*
************Script Requete********** 
*****Definition*****
requete.script.js permet de réaliser une requête asynchrone sur le serveur en utilisant l'objet xmlhttprequest.

*****Arguments*****
Tous les arguments sont des chaines de caractères
script
	C'est le script serveur appelé.
	Attention à entrer le chemin relatif du script, par exemple "../script.php".
methode
	C'est la methode utilisé pour l'appel du script. Cet argument peut valoir "post" ou "get".
	Le type de méthode doit être pris en compte par le script serveur, afin de récuperer correctement les paramètres qui lui sont envoyés ("$_POST[]" ou "$_GET[]" en PHP)
parametres
	C'est une chaine de caractères passee comme paramètre au script.
	Il est possible de passer plusieurs paramètres en les concatenant avec un "&".
	Par exemple "id=1&action=supprimer".
type
	C'est le type de resultat souhaité. Cet argument peut valoir "xml" ou "texte".
	Le type de resultat est important pour son traitement.
	Le type "xml" est à privilegier. Le type "texte" permet d'insérer le résultat dans le document HTML sans traitement à l'aide de la fonction innerHTML.
action
	C'est la fonction qui sera executée lorsque le resultat du script est parvenu au client.
	Cette fonction recevra comme premier paramètre le paramètre "source" (voir ci-dessous) et comme second paramètre le résultat de l'éxécution du script.
source
	Ce paramètre est utilisé pour "se rappeler" à partir de quel script source la fonction "requête" a été appelée.
	En effet, la fonction requête n'est liée à aucune autre, ce qui signifie que lorsque la reponse parvient au client et que la fonction "action" passée en paramètre est éxécutée, il n'y a aucun moyen de connaitre d'où la fonction a été éxécutée.
	De plus, il est possible de realiser plusieurs requêtes simultanément, et il faut pouvoir faire une distinction entre les différentes réponses qui parviennent au client (le fonctionnement de cette fonction étant asynchrone, il est possible que le résultat d'un premier appel à cette fonction parvienne après celui d'un second appel).
	Ce paramètre peut donc être utilisé pour traiter le résultat de la fonction "requete".
*/

function requete(script, methode, parametres, type, action, source) {
	//alert('script = ' + script + '\nparametres = ' + parametres + '\ntype = ' + type + '\naction = ' + action + '\nsource = ' + source);
	//creation de l'objet xhr
	var xhr = new XMLHttpRequest();

	//initialisation de la variable contenant le resultat
	var resultat = 'Chargement';
	//action lors de la réponse
	xhr.onreadystatechange = function() {
		//affichage pendant le chargement
		if(xhr.readyState != 4 || xhr.status != 200) {
			resultat += '.';
		}
		//une fois le chargement termine
		if(xhr.readyState == 4 && xhr.status == 200) {
			resultat = (type == 'xml') ? xhr.responseXML : xhr.responseText;
			action(source, resultat);
		}
	}

	//alert(parametres);
	if(methode == 'post') {
		xhr.open('POST', script, true);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(parametres);
	}
	else {
		xhr.open('GET', script + '?' + parametres);
		xhr.send(null);
	}
}