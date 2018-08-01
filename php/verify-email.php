<?php
  require 'connect-db.inc';

  $email = $_GET ['email'];
  $response = new stdClass();

  $db = connect_db();
  $stmt = $db->prepare("SELECT COUNT(id) FROM player WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $stmt->bind_result($resultado);
  $stmt->fetch();
  $response->resultado = $resultado;

  $stmt->close();
  $db->close();

  echo json_encode($response);
?>
