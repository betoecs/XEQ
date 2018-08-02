<?php
    require 'connect-db.inc';

    session_start();
    $db = connect_db();

    $response = new stdClass();
    $game_id = $_GET ['game_id'];
    $match_id = $_SESSION ['match_id'];
    $player_id = $_SESSION ['player_id'];
    $match_status = $_SESSION ['match_status'];

    if ($match_status == 'waiting for answer')
    {
        $stmt = $db->prepare('SELECT accepted FROM match_ WHERE id = ?');
    	$stmt->bind_param('i', $match_id);
    	$stmt->execute();
    	$stmt->bind_result($accepted);

        if ($stmt->fetch())
        {
            if ($accepted == '1')
                $response->status = 'joined';
            else if ($accepted == '2')
            {
                $stmt->close();

                $stmt = $db->prepare('DELETE FROM match_ WHERE id = ?');
            	$stmt->bind_param('i', $match_id);
            	$stmt->execute();

                unset($_SESSION ['game_id']);
                unset($_SESSION ['match_id']);
                unset($_SESSION ['match_status']);
                $response->status = 'challenge rejected';
            }
            else if ($accepted == '0')
                $response->status = 'waiting for ';
        }
        else
            $response->status = 'error';
    }
    else
    {
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
    }

    $stmt->close();
    $db->close();
    echo json_encode($response);
?>
