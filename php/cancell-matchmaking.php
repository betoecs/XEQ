<?php
	require 'connect-db.inc';

    session_start();
    $db = connect_db();
    $response = new stdClass();
    $match_id = $_SESSION ['match_id'];

    $stmt = $db->prepare('SELECT player2_id FROM match_ WHERE id = ?');
    $stmt->bind_param('i', $match_id);
    $stmt->execute();
    $stmt->bind_result($player2_id);

    if ($stmt->fetch())
    {
        if (player2_id != '')
        {
            $stmt->close();

            $stmt = $db->prepare('DELETE FROM match_ WHERE id = ?');
            $stmt->bind_param('i', $match_id);

            if ($stmt->execute())
            {
                $stmt->close();
                $response->status = 'ok';

                unset ($_SESSION ['match_id']);
                unset ($_SESSION ['is_player1']);
                unset ($_SESSION ['player_turn']);
                unset ($_SESSION ['match_status']);
            }
        }
        else
            $response->status = 'error';
    }
    else
        $response->status = 'error';

    $stmt->close();
    $db->close();
	echo json_encode($response);
?>
