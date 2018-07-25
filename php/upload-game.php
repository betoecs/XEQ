<?php
	/////////////////////////////////////////
	// Registered a new game on the db.
	/////////////////////////////////////////
    require 'connect-db.inc';

    $name = $_POST ['name'];
	$image = $_FILES ['image'];
	$js_file = $_FILES ['js-file'];

    $response = new stdClass();
    $db = connect_db();

    // Insert the new game to the db
    $stmt = $db->prepare('INSERT INTO game VALUES (NULL, ?, "")');
	$stmt->bind_param('s', $name);

	$response->status = (($stmt->execute()) ? 'ok' : 'error');
    $stmt->close();

    if ($response->status == 'ok')
    {
        // Get the new game id
        $stmt= $db->prepare('SELECT LAST_INSERT_ID()');
        $stmt->execute();
		$stmt->bind_result($game_id);
		$stmt->fetch();
		$stmt->close();

        // Move the image to the server
        $file_extension = pathinfo($_FILES ['image'] ['name'], PATHINFO_EXTENSION);
        $final_filename = $game_id.'.'.$file_extension;
        move_uploaded_file($_FILES ['image'] ['tmp_name'], '../assets/images/games/'.$final_filename);

        // Update image of the game on the db
        $stmt = $db->prepare('UPDATE game SET image = ? WHERE id = ?');
        $stmt->bind_param('si', $final_filename, $game_id);
        $stmt->execute();
        $stmt->close();

        // Move the js file to the server
        move_uploaded_file($_FILES ['js-file'] ['tmp_name'], '../assets/js/'.$game_id.'.js');
    }

    $db->close();
    echo json_encode($response);
?>
