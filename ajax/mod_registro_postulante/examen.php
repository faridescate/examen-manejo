<?php

/**
 * @author Farid Escate
 * @copyright 2011
 */

    header("content-type: application/x-javascript; charset=iso-8859-1");
    $bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
	
	$sql = "SELECT *, DATE_FORMAT(`examen_fecha`, '%d-%m-%Y') as `examen_fecha`" 
	. "FROM `tramite_examen` WHERE `fk_tramite`= '$_GET[pk_tramite]' ORDER BY `examen_tipo`";
	
	$result = $bbdd->query($sql);
	$examenes = array();
	while($examen = $result->fetch_assoc()){
		$examenes[] = $examen;
	}
	
	echo json_encode($examenes);
	$bbdd->close();

?>