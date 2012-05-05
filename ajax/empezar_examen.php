<?php
	$bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
	
	$sql = "UPDATE `mtc_examen`.`tramite_examen` SET `ESTADO` = 'EN CURSO' WHERE `tramite_examen`.`pk_examen` = $_POST[pk_examen];";
	
	$bbdd->query($sql);
	$bbdd->close();
?>