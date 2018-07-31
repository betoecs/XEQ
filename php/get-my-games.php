<?php
	require 'connect-db.inc';

	session_start();
	$player_id = $_SESSION ['player_id'];

	$response = new stdClass();
	$db = connect_db();
	$stmt = $db->prepare('SELECT game.id, game.name, game.image, play.stars FROM game
						  INNER JOIN play ON game.id =  play.game_id
						  WHERE play.player_id = ?');
	$stmt->bind_param('i', $player_id);

	if ($stmt->execute())
	{
		$response->status = 'ok';
		$response->games = array();

		$stmt->bind_result($id, $name, $image, $stars);
		while ($stmt->fetch())
			array_push($response->games, array('id' => $id, 'name' => $name, 'image' => $image, 'stars' => $stars));
	}
	else
	{
		$response->status = 'error';
	}

	$stmt->close();
	$db->close();
	echo json_encode($response);
?>
