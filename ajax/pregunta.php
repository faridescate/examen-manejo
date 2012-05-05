<?php
header("content-type: application/x-javascript; charset=iso-8859-1");
if (!empty($_GET["pk_pregunta"])){
    
    $bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');  
    
    $query = "SELECT examen_pregunta.pregunta_texto,
                     examen_pregunta.pk_pregunta, 
                     examen_pregunta.pregunta_imagen_ruta,
                     examen_pregunta_alternativa.alternativa_texto, 
                     examen_pregunta_alternativa.pk_alternativa, 
                     examen_pregunta_alternativa.alternativa_valor 
              FROM examen_pregunta,examen_pregunta_alternativa 
              WHERE examen_pregunta.pk_pregunta = examen_pregunta_alternativa.fk_pregunta 
                    and examen_pregunta.pk_pregunta='$_GET[pk_pregunta]'
              ORDER BY RAND()";  
    
    $i=0;
    if($resultado = $bbdd->query($query)){ 
        while($pregunta = $resultado->fetch_object()){ 
            $i++;
            if ($i == 1){
                $json = '
{"pregunta":
	{
	"id": "'.$pregunta->pk_pregunta.'", 
	"texto": "'.$pregunta->pregunta_texto.'",
	"image": "'.$pregunta->pregunta_imagen_ruta.'",
	"alternativas":
	  [';
			}
$json .= ' 
		{
		  "id": "'.$pregunta->pk_alternativa.'",
		  "texto": "'.$pregunta->alternativa_texto.'",
		  "valor": "'.$pregunta->alternativa_valor.'"
		}';
            if ($i < 3) $json .= ",";
        }
    $json .= "
	  ]
        }
    }";
    }
	
	echo trim($json);
    $bbdd->close();
}
?>