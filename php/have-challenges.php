<?php
	require 'connect-db.inc';

    session_start();
	$player_id = $_SESSION ['player_id'];
    $response = new stdClass();
    $db = connect_db();

    $stmt = $db->prepare('SELECT id FROM match_ WHERE player2_id = ? AND accepted = 0');
    $stmt->bind_param('i', $player_id);
    $stmt->execute();
    $stmt->bind_result($match_id);

    if ($stmt->fetch())
    {
        if ($match_id != '')
        {
            $response->status = 'new challenge';
			$_SESSION ['match_id'] = $match_id;
			$stmt->close();

			$stmt = $db->prepare('SELECT game_id, player1_id FROM match_ WHERE id = ?');
			$stmt->bind_param('i', $match_id);
			$stmt->execute();
			$stmt->bind_result($game_id, $player1_id);
			$stmt->fetch();
			$stmt->close();

			$stmt = $db->prepare('SELECT name FROM game WHERE id = ?');
	        $stmt->bind_param('i', $game_id);
	        $stmt->execute();
	        $stmt->bind_result($game_name);
			$stmt->fetch();

	        $response->game_name = $game_name;
	        $stmt->close();

	        $stmt = $db->prepare('SELECT nick FROM player WHERE id = ?');
	        $stmt->bind_param('i', $player1_id);
	        $stmt->execute();
	        $stmt->bind_result($friend_name);
			$stmt->fetch();

	        $response->friend_name = $friend_name;
        }
        else
            $response->status = 'nothing new';
    }

    $db->close();
	echo json_encode($response);
?>
