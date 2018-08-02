<?php
	require 'connect-db.inc';

	session_start();
	if (! isset($_SESSION ['match_id']))
		return;

	$match_id = $_SESSION ['match_id'];
	$command = new stdClass();
	$command->type = 'opponent-win';
	$command = json_encode($command);

	$db = connect_db();

	// Give up match
	if ($_SESSION ['is_player1'])
		$stmt = $db->prepare('UPDATE match_ SET player1_command = ? WHERE id = ?');
	else
		$stmt = $db->prepare('UPDATE match_ SET player2_command = ? WHERE id = ?');
	$stmt->bind_param('si', $command, $match_id);
	$stmt->execute();
	$stmt->close();

	// Decrease player stars
	$game_id = $_SESSION ['game_id'];
	$player_id = $_SESSION ['player_id'];
	$stmt = $db->prepare('UPDATE play SET stars = IF(stars > 14, stars - 15, 0) WHERE game_id = ? AND player_id = ?');
	$stmt->bind_param('ii', $game_id, $player_id);
	$stmt->execute();
	$stmt->close();

	$db->close();
?>
