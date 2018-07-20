<?php
	require 'connect-db.inc';

	session_start();
	$player_id = $_SESSION ['player_id'];

	$db = connect_db();
	$stmt = $db->prepare('UPDATE player SET online = 0 WHERE id = ?');
	$stmt->bind_param('i', $player_id);
	$stmt->execute();	
	$stmt->close();
	$db->close();
?>
