<?php
	header("content-type: application/x-javascript; charset=iso-8859-1");
    $bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
    
	$categoria = "SELECT * FROM examen_formula WHERE pk_examen_formula = '$_GET[fk_tramite_categoria]'";
	$total_preguntas = 40;
	
	$formula = array();
	
	if($resultado = $bbdd->query($categoria)){
		$formula = $resultado->fetch_assoc();
	}
	
	$cant[] = round($total_preguntas * $formula["p_normas"] / 100, 0);
	$cant[] = round($total_preguntas * $formula["p_manejo"] / 100, 0);
	$cant[] = round($total_preguntas * $formula["p_primeros_auxilios"] / 100, 0);
	$cant[] = round($total_preguntas * $formula["p_transporte"] / 100, 0);
	$cant[] = round($total_preguntas * $formula["p_mecanica"] / 100, 0);
	
	$sql = array();
	$tipo = array("NR", "MN", "PA", "TR", "MC");

	$pk_preguntas = array();
    //$pk_preguntas = "{\"pk\":[";
	
	for ($i = 0; $i <= 4; $i++){
		if ($cant[$i] > 0){
			$sql = "SELECT `pk_pregunta` FROM `examen_pregunta` 
				   WHERE `fk_tipo_pregunta` = '$tipo[$i]' 
				   ORDER BY RAND() LIMIT 0,$cant[$i]";
			
			if($resultado = $bbdd->query($sql)){
				while($pk_pregunta  = $resultado->fetch_array()){
					$pk_preguntas[] = $pk_pregunta[0];//"{\"valor\":\"".$pk_pregunta[0]."\"},";
				}
			}
		}
	}
	
    //$pk_preguntas = substr ($pk_preguntas, 0, strlen($pk_preguntas) - 1);
    
    //$pk_preguntas .= "]}";
	
    echo trim(json_encode($pk_preguntas));
    
    $bbdd->close();
?>