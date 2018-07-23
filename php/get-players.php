<?php
	require 'connect-db.inc';

	$nick = '%'.$_GET ['nick'].'%';
	$response = new stdClass();

	$db = connect_db();
	$stmt = $db->prepare('SELECT id, nick FROM player WHERE nick LIKE ?');
	$stmt->bind_param('s', $nick);

	if ($stmt->execute())
	{
		$response->status = 'ok';
		$stmt->bind_result($id, $nick);
		$response->players = array();

		while ($stmt->fetch())
			array_push($response->players, array('id' => $id, 'nick' => $nick));
	}
	else
	{
		$response->status = 'error';
	}

	$stmt->close();
	$db->close();
	echo json_encode($response);
?>
