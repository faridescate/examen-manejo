<?php

/**
 * @author farid
 * @copyright 2011
 */

    header("content-type: application/x-javascript; charset=iso-8859-1");
    $bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
	
	$sql = "SELECT `postulante`.* "
    . "FROM `postulante` \n"
    . "WHERE `postulante`.`pk_postulante` = '$_GET[pk_postulante]' \n";
	
	$result = $bbdd->query($sql);
	$postulante = $result->fetch_assoc();
	
	echo json_encode($postulante);
	$bbdd->close();

?>