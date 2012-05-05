<?php
	$bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
	
	$fecha = explode("-",$_POST['examen_fecha']);
	$_POST['examen_fecha'] = $fecha[2]."-".$fecha[1]."-".$fecha[0];
	
	$sql = "INSERT INTO `mtc_examen`.`tramite_examen` 
	(
		`pk_examen`, 
		`fk_tramite`, 
		`examen_fecha`, 
		`examen_puntaje`, 
		`ESTADO`, 
		`examen_tipo`
	) 
	VALUES 
	(
		NULL, 
		'$_POST[fk_tramite]',
		'$_POST[examen_fecha]', 
		'',
		'PENDIENTE',
		'$_POST[examen_tipo]'
	);
	";
	echo $sql;
	$bbdd->query($sql);
    $bbdd->close();
?>