<?php
	require 'connect-db.inc';
	require 'insert-into-my-games.inc';

	session_start();
	$player_id = $_SESSION ['player_id'];
	$game_id = $_GET ['game_id'];
	$response = new stdClass();

	$db = connect_db();

	// Looking for players waiting for opponent
	$stmt = $db->prepare('SELECT id FROM match_ WHERE game_id = ? AND player2_id IS NULL');
	$stmt->bind_param('i', $game_id);
	$stmt->execute();
	$stmt->bind_result($match_id);

	if ($stmt->fetch())
	{
		$stmt->close();
		$response->status = 'joined';

		// Join the match
		$stmt = $db->prepare('UPDATE match_ SET player2_id = ? WHERE id = ?');
		$stmt->bind_param('ii', $player_id, $match_id);
		$stmt->execute();
		$stmt->close();
	}
	else
	{
		$stmt->close();
		$response->status = 'wating for player';

		// Insert a new match
		$stmt = $db->prepare('INSERT INTO match_ VALUES (NULL, ?, ?, NULL, True, "")');
		$stmt->bind_param('ii', $game_id, $player_id);
		$stmt->execute();
		$stmt->close();
	}

	// Insert game into my games if it hasn't been added yet
	insert_into_my_games($db, $game_id, $player_id);

	$db->close();
	echo json_encode($response);
?>
