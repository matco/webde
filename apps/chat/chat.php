<?php
header('Content-type: application/xml');

//load config files
$config['db']['host'] = 'localhost';
$config['db']['port'] = 3306;
$config['db']['user'] = 'webde';
$config['db']['password'] = 'password';
$config['db']['base'] = 'webde';

//sanity check of http parameters
if($_POST) {
	foreach($_POST as $index => $valeur) {
		if(is_string($_POST[$index])) {
			$_POST[$index] = htmlentities($valeur, ENT_QUOTES, 'UTF-8');
		}
	}
}

echo '<?xml version="1.0" encoding="utf-8"?>';
echo '<div xmlns="http://www.w3.org/1999/xhtml">';

//use a mysql object
$db = new PDO(sprintf('mysql:host=%s;port=%d;dbname=%s', $config['db']['host'], $config['db']['port'], $config['db']['base']), $config['db']['user'], $config['db']['password']);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

//add a message
if($_SERVER['REQUEST_METHOD'] == 'POST') {
	if(!empty($_POST['pseudo']) and !empty($_POST['message'])) {
		$statement = $db->prepare("INSERT INTO chat(pseudo, message, ip) VALUES(:pseudo, :message, :ip)");
		$statement->bindParam('pseudo', $_POST['pseudo'], PDO::PARAM_STR);
		$statement->bindParam('message', $_POST['message'], PDO::PARAM_STR);
		$statement->bindParam('ip', $_SERVER['REMOTE_ADDR'], PDO::PARAM_STR);
		$statement->execute();
	}
	else {
		echo '<span >All fields are required!</span>';
	}
}

$statement = $db->query('SELECT id, UNIX_TIMESTAMP(time) as time, pseudo, message FROM chat ORDER BY time DESC LIMIT 10');
$messages = $statement->fetchAll(PDO::FETCH_ASSOC);

echo '<ul xmlns="http://www.w3.org/1999/xhtml">';
foreach($messages as $message) {
	$time = date('H:i:s', $message['time']);
	$date = date('d/m/y', $message['time']);
	printf('<li><span tooltip="message-%d" style="font-size: 8px; padding-right: 5px;">%s</span><strong>%s</strong> : %s</li><p id="message-%d" class="tooltip">%s</p>',
		$message['id'],
		$time,
		$message['pseudo'],
		$message['message'],
		$message['id'],
		$date);
}
echo '</ul>';

echo '</div>';
?>