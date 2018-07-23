<?php
	require 'connect-db.inc';

	$nick = $_POST ['nick'];
	$email = $_POST ['email'];
	$password = $_POST ['password'];

	$response = new stdClass();
	$db = connect_db();
	$stmt = $db->prepare('INSERT INTO player VALUES (NULL, ?, ?, SHA2(?, 256), "de.jpg", 1)');
	$stmt->bind_param('sss', $nick, $email, $password);

	$response->status = (($stmt->execute()) ? 'ok' : 'error');

	if ($response->status == 'ok')
	{
		$stmt->close();
		$stmt = $db->prepare('SELECT LAST_INSERT_ID()');
		$stmt->execute();
		$stmt->bind_result($player_id);
		$stmt->fetch();

		session_start();
		$_SESSION ['player_id'] = $player_id;
	}

	$stmt->close();
	$db->close();
	echo json_encode($response);
?>
