<?php
	$uri = $_GET ['uri_0'];

	if ($uri == '')
		header('Location: homepage.html');

	if ($uri == 'xeq.html')
	{
		session_start();
		if (isset($_SESSION ['player_id']))
			header('Location: xeq.html');
		else
			header('Location: homepage.html');
	}
?>
