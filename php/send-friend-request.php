<?php
	require 'connect-db.inc';
	require 'friends-state.inc';

	session_start();
	$player1_id = $_SESSION ['player_id'];
	$player2_id = $_GET ['to'];
	$response = new stdClass();

	if ($player1_id == $player2_id)
	{
		$response->status = "You are you're friend";
		echo json_encode($response);
		return;
	}
	$db = connect_db();

	// fetch friends register
	$stmt = $db->prepare('SELECT id, state FROM friends WHERE (player1_id = ? AND player2_id = ?) OR (player1_id = ? AND player2_id = ?)');
	$stmt->bind_param('iiii', $player1_id, $player2_id, $player2_id, $player1_id);
	$stmt->execute();
	$stmt->bind_result($friends_id, $state);

	if ($stmt->fetch())
	{
		$stmt->close();

		$state = (int) $state;
		switch ($state)
		{
			case FriendsState::Accepted:
				$response->status = 'You are already friends';
			break;

			case FriendsState::Sent:
				$response->status = "Request hasn't yet been accepted";
			break;

			case FriendsState::Rejected:
				$stmt = $db->prepare('UPDATE friends SET state = 1, player1_id = ?, player2_id = ? WHERE id = ?');
				$stmt->bind_param('iii', $player1_id, $player2_id, $friends_id);
				$stmt->execute();
				$stmt->close();
				$response->status = 'ok';
		}
	}
	else // No friends??, insert into friends
	{
		$stmt->close();
		$stmt = $db->prepare('INSERT INTO friends VALUES (NULL, 1, ?, ?)');
		$stmt->bind_param('ii', $player1_id, $player2_id);
		$response->status = (($stmt->execute()) ? 'ok' : 'Something went wrong');
		$stmt->close();
	}

	$db->close();
	echo json_encode($response);
?>
