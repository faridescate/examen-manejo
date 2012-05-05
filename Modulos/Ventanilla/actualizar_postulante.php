<?php
	require_once($_SERVER[DOCUMENT_ROOT]."mtc_examen/conexion/bbdd.php");
	
	$sql = "UPDATE `mtc_examen`.`postulante` ".
	"SET `Nombres` = '$_POST[nombres]', `Apellidos` = '$_POST[apellidos]' ".
	"WHERE `postulante`.`pk_postulante` = '$_POST[pk_postulante]';";
	
	$result = $bbdd->query($sql);
	echo var_dump($_POST[examen_fecha]);
	$bbdd->close();
?>