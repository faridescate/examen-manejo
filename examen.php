<?php
	session_start();
	if ($_SESSION["usuario_tipo"] == "AYUDANTE EXAMEN"){
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es-es" lang="es-es" >
<head>
    <meta http-equiv="content-type" content="text/html; charset=iso-8859-1"/>
    <title>MTC-EXAMEN</title>
    <script type="text/javascript" src="js/jquery-1.5.1.js"></script>
    <script type="text/javascript" src="js/jquery.functions.js"></script>
    <link rel="stylesheet" type="text/css" href="css/estilos.css" media="screen" />
    <script language="javascript" type="text/javascript">
	if (terminar == false){
		window.onbeforeunload = function (e) {
		var e = e || window.event;
		msj = "NO CIERRE la pagina sin haber terminado el examen";
		// For IE and Firefox
		if (e) {
			e.returnValue = msj;
		}
		// For Safari
		return msj;
		}
	}
    </script>
</head>
<body>
<div id="content">
    <div id="ingreso">
	<a id="salir" href="logout.php">Salir</a>
    <form method="post" action="examen.php" id="frm_postulante">
         <input type="text" value="" id="postulante" size="8" autocomplete="off" title="Nº DNI"/>
    </form>
    </div>
    <div id="examen">
    <form id="frm_examen">
		<div id="datos_postulante"></div>
        <div id="pregunta">
            <p id="pregunta_texto"></p>
            <img id="image" width="130px" align="right"/>
            <div id="alternativas">
                <p><input type="radio" name="alternativas" id="0" value="0" disabled="disabled"/><label for="0"></label></p>
                <p><input type="radio" name="alternativas" id="1" value="1"  disabled="disabled"/><label for="1"></label></p>
                <p><input type="radio" name="alternativas" id="2" value="2" disabled="disabled"/><label for="2"></label></p>
            </div>
        </div>
        <input type="button" value="siguiente" id="siguiente" disabled="disabled"/>
		<input type="button" value="finalizar" id="finalizar"/>
        <p><input type="text" disabled="" value="" id="tiempo" size="2"/></p>
    </form>
    </div>
	<div id="resultados" style="display:none">
		<p><input type="text" disabled="" value="" id="conteo" size="2"/></p>
	</div>
</div>
</body>
</html>
<?php
	} else {
		header("location: index.php");
	}
?>