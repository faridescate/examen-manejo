<?php
	$bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
	
	$sql = "UPDATE `mtc_examen`.`tramite_examen`"
	." SET `ESTADO` = '$_POST[estado]', `EXAMEN_PUNTAJE` = '$_POST[puntaje]'"
    ." WHERE `tramite_examen`.`pk_examen` = '$_POST[pk_examen]';";
	
	$result = $bbdd->query($sql);
	echo var_dump($_POST[pk_examen]);
	$bbdd->close();
?>