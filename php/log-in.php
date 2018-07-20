<?php
	require 'connect-db.inc';

	$nick = $_POST ['nick'];
	$password = $_POST ['password'];
	$response = new stdClass();

	$db = connect_db();
	$stmt = $db->prepare('SELECT id FROM player WHERE nick = ? AND password = SHA2(?, 256)');
	$stmt->bind_param('ss', $nick, $password);
	$stmt->execute();
	$stmt->bind_result($player_id);

	if ($stmt->fetch())
	{
		$response->status = 'ok';
		session_start();
		$_SESSION ['player_id'] = $player_id;

		$stmt->close();
		$stmt = $db->prepare('UPDATE player SET online = 1 WHERE id = ?');
		$stmt->bind_param('i', $player_id);
		$stmt->execute();
	}
	else
	{
		$response->status = 'error';
	}

	$stmt->close();
	$db->close();
	echo json_encode($response);
?>
