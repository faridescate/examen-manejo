<?php ob_start(); session_start();?>
<?php
if (!empty($_POST) && empty($_SESSION)){
	if (!empty($_POST['usuario']) && !empty($_POST['contraseña'])){
		$_POST['contraseña'] = md5($_POST['contraseña']);
		$bbdd = new mysqli('localhost', 'root', '', 'mtc_examen');
	
		$sql = "SELECT `usuario`.`pk_usuario`, `usuario`.`usuario_tipo` \n" 
		. " FROM  `usuario` \n"
		. " WHERE `usuario`.`pk_usuario` = '$_POST[usuario]' && `usuario_password` = '$_POST[contraseña]' \n";
	
		$result = $bbdd->query($sql);
		$postulante = $result->fetch_array(MYSQLI_ASSOC);
		if (!empty($postulante['pk_usuario']) && !empty($postulante['usuario_tipo'])){
			$_SESSION['usuario'] = $postulante['pk_usuario'];
			$_SESSION['usuario_tipo'] = $postulante['usuario_tipo'];
		} else {
			$msj = "USUARIO O CLAVE INCORECTAS";
		}
	}
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es-es" lang="es-es" >
<head>
    <meta http-equiv="content-type" content="text/html; charset=iso-8859-1"/>
    <title>MTC-EXAMEN</title>
    <script type="text/javascript" src="js/jquery-1.5.1.js"></script>
    <script type="text/javascript" src="js/jquery.registro.js"></script>
    <link rel="stylesheet" type="text/css" href="css/estilos.css" media="screen" />
</head>
<body>
<div id="content">
<?php
if(!empty($_SESSION['usuario_tipo'])){
	if ($_SESSION['usuario_tipo'] == 'REGISTRADOR'){
		header("location: registro_postulante.php");
	} elseif ($_SESSION['usuario_tipo'] == 'JEFE') {
		header("location: jefe_licencias.php");
	} elseif ($_SESSION['usuario_tipo'] == 'AYUDANTE EXAMEN') {
		header("location: examen.php");
	} else {
		unset($_SESSION);
		header("location: index.php");
	}
} else { 
?>
<div id="login">
    <form method="post" action="" id="frm_login" name="frm_login">
         <input type="text" value="" name="usuario"id="usuario" size="8" autocomplete="off" title="Usuario"/>
         <!--<label for="usuario">Usuario</label>-->
         <input type="password" value="" name="contraseña" id="contraseña" size="12" autocomplete="off" title="Contraseña"/>
         <!--</a><label for="contraseña">Contraseña</label>-->
		 <input type="submit" value="INGRESAR" id="ingresar" name="ingresar">
    </form>
</div>
<?php
}
?>
</div>
</body>
</html>
<?php ob_end_flush(); ?>