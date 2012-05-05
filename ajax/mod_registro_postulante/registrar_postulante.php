<?php
    $bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
	
	$sql = "INSERT INTO `mtc_examen`.`postulante` (`pk_postulante`, `Nombres`, `Apellidos`)"
	.  "VALUES ('$_POST[pk_postulante]', '$_POST[Nombres]', '$_POST[Apellidos]');";
	
	$bbdd->query($sql);
    $bbdd->close();
?>