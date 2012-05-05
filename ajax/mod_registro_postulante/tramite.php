<?php

/**
 * @author Farid Escate
 * @copyright 2011
 */

    header("content-type: application/x-javascript; charset=iso-8859-1");
    $bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
	
	$sql = 
	"SELECT `pk_tramite`, `fk_tramite_categoria`, `tramite_fecha`, "
	. "`ESTADO`, DATE_FORMAT(`tramite_examen_medico`, '%d-%m-%Y') as 'tramite_examen_medico', `codigo_registro`, "
	. "`tramite_tipo_licencia`, `tramite_tipo` "
	. "FROM `postulante_tramite` "
	. "WHERE `postulante_tramite`.`fk_postulante` = '$_GET[pk_postulante]' ORDER BY `ESTADO`\n";
	
	$result = $bbdd->query($sql);
	$tramites = array();
	while($tramite = $result->fetch_assoc()){
		$tramites[] = $tramite;
	}
	
	echo json_encode($tramites);
	$bbdd->close();

?>