<?php
	require 'connect-db.inc';
	require 'insert-into-my-games.inc';

	session_start();
	$player_id = $_SESSION ['player_id'];
	$game_id = $_GET ['game_id'];
	$response = new stdClass();

	$db = connect_db();

	if (isset($_GET ['friend_id']))
	{
		$friend_id = $_GET ['friend_id'];
		$stmt = $db->prepare('INSERT INTO match_ VALUES (NULL, ?, ?, ?, True, "", "", 0)');
		$stmt->bind_param('iii', $game_id, $player_id, $friend_id);
		$stmt->execute();
		$stmt->close();
		$response->status = 'waiting for answer';

		// Get match id
		$stmt = $db->prepare('SELECT LAST_INSERT_ID()');
		$stmt->execute();
		$stmt->bind_result($match_id);
		$stmt->fetch();
		$stmt->close();

		$_SESSION ['player_turn'] = true;
		$_SESSION ['is_player1'] = true;
		$_SESSION ['match_status'] = 'waiting for answer';
	}
	else
	{
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

			$_SESSION ['player_turn'] = false;
			$_SESSION ['is_player1'] = false;
		}
		else // No players waiting for opponent, create a new match
		{
			$stmt->close();
			$response->status = 'wating for player';

			// Insert a new match
			$stmt = $db->prepare('INSERT INTO match_ VALUES (NULL, ?, ?, NULL, True, "", "", NULL)');
			$stmt->bind_param('ii', $game_id, $player_id);
			$stmt->execute();
			$stmt->close();

			// Get match id
			$stmt = $db->prepare('SELECT LAST_INSERT_ID()');
			$stmt->execute();
			$stmt->bind_result($match_id);
			$stmt->fetch();
			$stmt->close();

			$_SESSION ['player_turn'] = true;
			$_SESSION ['is_player1'] = true;
		}
	}

	$_SESSION ['match_id'] = $match_id;
	$_SESSION ['game_id'] = $game_id;

	// Insert game into my games if it hasn't been added yet
	insert_into_my_games($db, $game_id, $player_id);

	$db->close();
	echo json_encode($response);
?>
