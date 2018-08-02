<?php
    require 'connect-db.inc';
    require 'insert-into-my-games.inc';

    $response = new stdClass();
    session_start();

    if (! isset($_SESSION ['player_id']) || ! isset($_POST ['game_id']))
    {
        $response->status = 'error';
        echo json_encode($response);
        return;
    }

    $db = connect_db();
    $response->status = (insert_into_my_games($db, $_POST ['game_id'], $_SESSION ['player_id']) ? 'ok' : 'already added');
    $db->close();
    echo json_encode($response);
?>
