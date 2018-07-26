<?php
	function insert_into_my_games($db, $game_id, $player_id)
	{
		// Verify it hasn't been added yet
		$stmt = $db->prepare('SELECT COUNT(*) FROM play WHERE game_id = ? AND player_id = ?');
		$stmt->bind_param('ii', $game_id, $player_id);
		$stmt->execute();

		if ($stmt->fetch())
		{
			$stmt->close();
			return;
		}

		// Insert it
		$stmt->close();
		$stmt = $db->prepare('INSERT INTO player VALUES (NULL, 0, ?, ?)');
		$stmt->bind_param('ii', $game_id, $player_id);
		$stmt->execute();
		$stmt->close();
	}
?>
