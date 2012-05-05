<?php
	header("content-type: application/x-javascript; charset=iso-8859-1");
    $bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
	
	$sql = "SELECT `postulante`.* ,`postulante_tramite`.* , `tramite_examen`.*\n"
    . "FROM `postulante` \n"
    . "LEFT JOIN `postulante_tramite`\n"
    . "ON `postulante`.`pk_postulante` = `postulante_tramite`.`fk_postulante`\n"
    . "LEFT JOIN `tramite_examen`\n"
    . "ON `postulante_tramite`.`pk_tramite` = `tramite_examen`.`fk_tramite`\n"
    . "WHERE postulante.pk_postulante = $_GET[pk_postulante] && tramite_examen.ESTADO = 'PENDIENTE'\n"
    . "&& `tramite_examen`.`examen_tipo` = 'REGLAS'\n"
    . "\n";
	
	$result = $bbdd->query($sql);
	$postulante = $result->fetch_assoc();
	
	echo json_encode($postulante);
	$bbdd->close();
?>