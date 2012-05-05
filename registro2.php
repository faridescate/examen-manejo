<?php
	session_start();
	if ($_SESSION["usuario_tipo"] == "REGISTRADOR"){
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es-es" lang="es-es" >
<head>
    <title>MTC-EXAMEN</title>
    <script type="text/javascript" src="js/jquery-1.5.1.js"></script>
    <!--<script type="text/javascript" src="js/jquery.registro.js"></script>-->
    <script type="text/javascript" src="js/jquery.registro2.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.8.11.custom.min"></script>
	<script type="text/javascript" src="js/jquery-ui-i18n.min"></script>
    <link rel="stylesheet" type="text/css" href="css/registro_estilos.css" media="screen" />
	<link rel="stylesheet" type="text/css" href="css/ui-lightness/jquery-ui-1.8.11.custom.css" media="screen" />
</head>
<body>
<div id="content">
	<a id="salir" href="logout.php">Salir</a>
	<fieldset id="postulante">
		<legend>Postulante</legend>
        <label for="dni">DNI<br />
		<input type="text" name="dni" id="dni" autocomplete="off" title="Nº DNI" size="8" maxlength="8"/></label>
		<label for="apellidos">APELLIDOS<br />
		<input type="text" name="apellidos" id="apellidos" autocomplete="off" title="Apellidos" disabled="disabled"/></label>	
        <label for="nombre">NOMBRES<br />
		<input type="text" name="nombre" id="nombre" autocomplete="off" title="Nombres" disabled="disabled"/></label>
		<input type="button" name="grabar_postulante" id="grabar_postulante" value="GRABAR" style="display:none"/>
		<input type="button" name="editar_postulante" id="editar_postulante" value="EDITAR" style="display:none"/>
	</fieldset>
	<table id="tramite" summary="Tramite">		
	</table>
</div>
</body>
</html>
<?php
	} else {
		header("location: index.php");
	}
?>