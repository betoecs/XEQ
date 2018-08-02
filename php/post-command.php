<?php
    require 'connect-db.inc';

    $response = new stdClass();
    session_start();

    // Verify $_SESSION and $_POST values
    if (! isset($_SESSION ['match_id']) || ! isset($_SESSION ['player_turn']) || ! $_SESSION ['player_turn'] || ! isset($_POST ['command']))
    {
        $response->status = 'error';
        echo json_encode($response);
        return;
    }

    $match_id = $_SESSION ['match_id'];
    $command = $_POST ['command'];

    // Update match command
    $db = connect_db();

    if ($_SESSION ['is_player1'])
        $stmt = $db->prepare('UPDATE match_ SET player1_command = ?, player1_turn = ! player1_turn WHERE id = ?');
    else
        $stmt = $db->prepare('UPDATE match_ SET player2_command = ?, player1_turn = ! player1_turn WHERE id = ?');

    $stmt->bind_param('si', $command, $match_id);
    $response->status = ($stmt->execute()) ? 'ok' : 'error';
    $stmt->close();

    $_SESSION ['player_turn'] = false;

    // The opponent won
    $command = json_decode($command);
    if ($command->type == 'opponent-win')
    {
        unset($_SESSION ['match_id']);
        unset($_SESSION ['$match_status']);
        unset($_SESSION ['player_turn']);
        unset($_SESSION ['is_player1']);
        $game_id = $_SESSION ['game_id'];
        unset($_SESSION ['game_id']);
        $player_id = $_SESSION ['player_id'];

        // Decrease player stars
        $stmt = $db->prepare('UPDATE play SET stars = IF(stars > 14, stars - 15, 0) WHERE game_id = ? AND player_id = ?');
        $stmt->bind_param('ii', $game_id, $player_id);
        $stmt->execute();
        $stmt->close();
    }

    $db->close();
    echo json_encode($response);
?>
