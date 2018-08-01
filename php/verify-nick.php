<?php
  require 'connect-db.inc';

  $nick = $_GET ['nick'];
  $response = new stdClass();

  $db = connect_db();
  $stmt = $db->prepare("SELECT COUNT(id) FROM player WHERE nick = ?");
  $stmt->bind_param("s", $nick);
  $stmt->execute();
  $stmt->bind_result($resultado);
  $stmt->fetch();
  $response->resultado = $resultado;

  $stmt->close();
  $db->close();

  echo json_encode($response);
?>
