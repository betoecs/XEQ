<?php
	function insert_into_my_games($db, $game_id, $player_id)
	{
		// Verify it hasn't been added yet
		$stmt = $db->prepare('SELECT COUNT(*) FROM play WHERE game_id = ? AND player_id = ?');
		$stmt->bind_param('ii', $game_id, $player_id);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();

		if ($result == '1')
		{
			$stmt->close();
			return false;
		}

		// Insert it
		$stmt->close();
		$stmt = $db->prepare('INSERT INTO play VALUES (NULL, 0, ?, ?)');
		$stmt->bind_param('ii', $game_id, $player_id);
		$stmt->execute();
		$stmt->close();
		return true;
	}
?>
