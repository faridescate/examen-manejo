<?php
$bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
$dir = "F:/server2go/htdocs/mtc_examen/images/";
 
// Abre un directorio conocido, y procede a leer el contenido
if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
        while (($file = readdir($dh)) !== false) {
            $images[] = "$file : <br>";
        }
        closedir($dh);
    }
}
    unset($images[0]);
    unset($images[1]);
    unset($images[2]);
    
    foreach($images as $image){
        $id = substr($image,0,3);
        $fName = substr($image,0,-7);
        
        $sql = "
        UPDATE `mtc_examen`.`examen_pregunta` 
        SET `pregunta_imagen_ruta` = 'images/$fName' 
        WHERE `examen_pregunta`.`pk_pregunta` = '$id';";
        
        $bbdd->query($sql);
        echo  $bbdd->affected_rows;
    }
$bbdd->close();
?>
