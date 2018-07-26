<?php
	require 'connect-db.inc';
	require 'friends-state.inc';

	session_start();
	$applicant_id = $_GET ['id'];
	$state = ($_GET ['accepted']  == 'true') ? FriendsState::Accepted : FriendsState::Rejected;
	$player2_id = $_SESSION ['player_id'];

	$db = connect_db();
	$stmt = $db->prepare('UPDATE friends SET state = ? WHERE player1_id = ? AND state = 1 AND player2_id = ?');
	$stmt->bind_param('iii', $state, $applicant_id, $player2_id);

	$response = new stdClass();
	$response = ($stmt->execute()) ? 'ok' : 'error';

	$stmt->close();
	$db->close();
	echo json_encode($response);
?>
