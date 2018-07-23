<?php
	require 'connect-db.inc';

	session_start();
	$player_id = $_SESSION ['player_id'];
	$response = new stdClass();

	$db = connect_db();

	// Get friends
	$stmt = $db->prepare('SELECT id, nick, online, image FROM player
						  WHERE id IN (SELECT player2_id FROM friends WHERE player1_id = ? AND state = 2) OR
						  		id IN (SELECT player1_id FROM friends WHERE player2_id = ? AND state = 2)');
	$stmt->bind_param('ii', $player_id, $player_id);

	if (! $stmt->execute())
	{
		$response->status = 'error';
		$stmt->close();
		$db->close();
		echo json_encode($response);
		return;
	}

	$response->status = 'ok';
	$response->friends = array();
	$stmt->bind_result($id, $nick, $online, $image);

	while ($stmt->fetch())
		array_push($response->friends, array('id' => $id, 'nick' => $nick, 'online' => $online, 'image' => $image));

	$stmt->close();
	$db->close();
	echo json_encode($response);
?>
