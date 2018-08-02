<?php
    require 'connect-db.inc';

    $response = new stdClass();
    session_start();

    // Verify $_SESSION data
    if (! isset($_SESSION ['match_id']) || ! isset($_SESSION ['player_turn']))
    {
        $response->status = 'error';
        echo json_encode($response);
        return;
    }

    $match_id = $_SESSION ['match_id'];

    // Retrieve opponent command
    $db = connect_db();

    if ($_SESSION ['is_player1'])
        $stmt = $db->prepare('SELECT player2_command FROM match_ WHERE id = ?');
    else
        $stmt = $db->prepare('SELECT player1_command FROM match_ WHERE id = ?');

    $stmt->bind_param('i', $match_id);
    $stmt->execute();
    $stmt->bind_result($command);
    $stmt->fetch();
    $response->status = ($command != '') ? 'ok' : 'no command';
    $stmt->close();

    // Update player turn
    if ($response->status == 'ok')
    {
        $response->command = $command;
        $_SESSION ['player_turn'] = true;

        if ($_SESSION ['is_player1'])
            $stmt = $db->prepare('UPDATE match_ SET player2_command = "" WHERE id = ?');
        else
            $stmt = $db->prepare('UPDATE match_ SET player1_command = "" WHERE id = ?');

        $stmt->bind_param('i', $match_id);
        $stmt->execute();
        $stmt->close();

	    $command = json_decode($command);

		// Draw or win??
		if ($command->type != 'movement')
		{
	        unset($_SESSION ['match_id']);
	        unset($_SESSION ['player_turn']);
	        unset($_SESSION ['is_player1']);
	        unset($_SESSION ['$match_status']);
	        $game_id = $_SESSION ['game_id'];
	        unset($_SESSION ['game_id']);
	        $player_id = $_SESSION ['player_id'];

	        // Remove match record
	        $stmt = $db->prepare('DELETE FROM match_ WHERE id = ?');
	        $stmt->bind_param('i', $match_id);
	        $stmt->execute();
	        $stmt->close();

			// The player won
			if ($command->type == 'opponent-win')
			{
		        // Increase player stars
		        $stmt = $db->prepare('UPDATE play SET stars = stars + 30 WHERE game_id = ? AND player_id = ?');
		        $stmt->bind_param('ii', $game_id, $player_id);
		        $stmt->execute();
		        $stmt->close();
			}
		}
    }

    $db->close();
    echo json_encode($response);
?>
