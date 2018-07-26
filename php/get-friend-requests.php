<?php
	require 'connect-db.inc';

	session_start();
	$player2_id = $_SESSION ['player_id'];
	$response = new stdClass();

	$db = connect_db();
	$stmt = $db->prepare('SELECT id, nick, online, image FROM player
						  WHERE id IN (SELECT player1_id FROM friends WHERE player2_id = ? AND state = 1)');
	$stmt->bind_param('i', $player2_id);

	if ($stmt->execute())
	{
		$response->status = 'ok';
		$stmt->bind_result($id, $nick, $online, $image);
		$response->requests = array();

		while ($stmt->fetch())
			array_push($response->requests, array('id' => $id, 'nick' => $nick, 'online' => $online, 'image' => $image));
	}
	else
	{
		$response->status = 'error';
	}

	$stmt->close();
	$db->close();
	echo json_encode($response);
?>
