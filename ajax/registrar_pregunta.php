<?php
    $bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
	
	//if ($_POST["alt_marcada" == ""])
		
	
	$sql  = "
	INSERT INTO `mtc_examen`.`examen_registro` (
		`pk_registro` ,
		`fk_examen` ,
		`fk_pregunta` ,
		`cod_alternativa_a` ,
		`cod_alternativa_b` ,
		`cod_alternativa_c` ,
		`alternativa_marcada` ,
		`alternativa_correcta` ,
		`pregunta_valor` ,
		`pregunta_numero` 
		)
	";
	$sql .= "
	VALUES (
		NULL ,
		'$_POST[fk_examen]',
		'$_POST[fk_pregunta]',
		'$_POST[alt_a]',
		'$_POST[alt_b]',
		'$_POST[alt_c]',
		'$_POST[alt_marcada]',
		'$_POST[alt_correcta]',
		'$_POST[pregunta_valor]',
		'$_POST[pregunta_numero]'
		);
	";
	$bbdd->query($sql);
    $bbdd->close();
?>