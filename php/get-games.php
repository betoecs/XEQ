<?php
	require 'connect-db.inc';

	$response = new stdClass();
	$db = connect_db();
	$stmt = $db->prepare('SELECT id, name, image FROM game');

	if ($stmt->execute())
	{
		$response->status = 'ok';
		$response->games = array();

		$stmt->bind_result($id, $name, $image);
		while ($stmt->fetch())
			array_push($response->games, array('id' => $id, 'name' => $name, 'image' => $image));
	}
	else
	{
		$response->status = 'error';
	}

	$stmt->close();
	$db->close();
	echo json_encode($response);
?>
