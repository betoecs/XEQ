<?php
	require 'connect-db.inc';

    session_start();
	$answer = $_GET ['answer'];
    $match_id = $_SESSION ['match_id'];
    $response = new stdClass();
    $db = connect_db();

    $stmt = $db->prepare('UPDATE match_ SET accepted = ? WHERE id = ?');
    $stmt->bind_param('ii', $answer, $match_id);

    if ($stmt->execute())
    {
        $stmt->close();
        $response->status = 'success';

		if ($answer == '1')
		{
			$stmt = $db->prepare('SELECT game_id FROM match_ WHERE id = ?');
			$stmt->bind_param('i', $match_id);
			$stmt->execute();
			$stmt->bind_result($game_id);
			$stmt->fetch();
			$response->game_id = $game_id;

			$_SESSION ['player_turn'] = false;
			$_SESSION ['is_player1'] = false;
    }
}
    else
        $response->status = 'error';

    $stmt->close();
    $db->close();
	echo json_encode($response);
?>
