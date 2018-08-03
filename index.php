<?php
	session_start();

	if (isset($_SESSION ['player_id']))
		require 'xeq.html';
	else
		require 'homepage.html';

?>
