<?php
	$bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
	
	
	$fecha = explode("-",$_POST['examen_fecha']);	
	$_POST['examen_fecha'] = $fecha[2]."-".$fecha[1]."-".$fecha[0];
	
	$sql = "UPDATE `mtc_examen`.`tramite_examen`"
	." SET `examen_fecha` = '$_POST[examen_fecha]'"
    ." WHERE `tramite_examen`.`pk_examen` = '$_POST[pk_examen]';";
	
	$result = $bbdd->query($sql);
	echo var_dump($_POST[examen_fecha]);
	$bbdd->close();
?>