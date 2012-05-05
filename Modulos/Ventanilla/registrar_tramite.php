<?php
    require_once($_SERVER[DOCUMENT_ROOT]."mtc_examen/conexion/bbdd.php");
	
	$fk_tramite_categoria = substr($_POST['tramite_tipo_licencia'], 0, 2);
	$fecha = explode("-",$_POST['tramite_examen_medico']);
	
	$_POST['tramite_examen_medico'] = $fecha[2]."-".$fecha[1]."-".$fecha[0];
	
	$sql =
	"INSERT INTO `mtc_examen`.`postulante_tramite`(
		`pk_tramite`, 
		`fk_postulante`, 
		`fk_tramite_categoria`, 
		`tramite_fecha`, 
		`ESTADO`, 
		`tramite_examen_medico`, 
		`codigo_registro`, 
		`tramite_tipo_licencia`, 
		`tramite_tipo`) 
	VALUES (
		NULL, 
		'$_POST[fk_postulante]', 
		'$fk_tramite_categoria', 
		CURRENT_TIMESTAMP,
		'$_POST[ESTADO]', 
		'$_POST[tramite_examen_medico]', 
		'$_POST[codigo_registro]',
		'$_POST[tramite_tipo_licencia]',
		'$_POST[tramite_tipo]');";
	
	$bbdd->query($sql);
    $bbdd->close();
?>