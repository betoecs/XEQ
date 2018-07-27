<?php
    require 'connect-db.inc';

    session_start();
    $db = connect_db();

    $response = new stdClass();
    $game_id = $_GET ['game_id'];
    $player_id = $_SESSION ['player_id'];

    $stmt = $db->prepare('SELECT player2_id FROM match_ WHERE game_id = ? AND player1_id = ?');
	$stmt->bind_param('ii', $game_id, $player_id);
	$stmt->execute();
	$stmt->bind_result($player2_id);

    if ($stmt->fetch())
    {
        if ($player2_id != "")
            $response->status = 'joined';
        else
            $response->status = 'waiting for player';
    }
    else
        $response->status = 'error';

    $stmt->close();
    $db->close();
    echo json_encode($response);
?>
