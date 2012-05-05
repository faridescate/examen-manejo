<?php

/**
 * @author Farid Escate
 * @copyright 2011
 */
	$nreglas = 0;
	$nmanejo = 0;
	$nmecani = 0;
    header("content-type: application/x-javascript; charset=iso-8859-1");
    require_once($_SERVER[DOCUMENT_ROOT]."mtc_examen/conexion/bbdd.php");
	$reglas = $manejo = $mecanico = true;
	$sql = "SELECT *, DATE_FORMAT(`examen_fecha`, '%d-%m-%Y') as `examen_fecha`" 
	. "FROM `tramite_examen` WHERE `fk_tramite`= '$_POST[pk_tramite]' ORDER BY `ESTADO`";
	
	$result = $bbdd->query($sql);
	$examenes = array();
	
	$thead = 
	"<thead>
		<th>TIPO</th>
		<th>FECHA</th>
		<th>NOTA</th>
		<th>ESTADO</th>
		<th>OPCION</th>
	</thead>";
	$tbody = "<tbody>";
	while($examen = $result->fetch_assoc()){
		$tbody .=
		"<tr id='$examen[pk_examen]'>"
		." <td class='lbl_tipo'>$examen[examen_tipo]</td>"
		." <td class='lbl_fecha'>$examen[examen_fecha]</td>"
		." <td>$examen[examen_puntaje]</td>"
		." <td>$examen[ESTADO]</td>"
		." <td>";
        if ($examen[ESTADO] != "PENDIENTE")
			$disabled = "disabled='disabled'";
		else 
			$disabled = "";
		if  ($examen[ESTADO] == "PENDIENTE"){
			if ($examen[examen_tipo] == "REGLAS")
				$reglas = false;
			if ($examen[examen_tipo] == "MANEJO")
				$manejo = false;
			if ($examen[examen_tipo] == "MECANICO")
				$mecanico = false;
		}
		if  ($examen[ESTADO] == "DESAPROBADO"){
			if ($examen[examen_tipo] == "REGLAS")
				$nreglas += 1;
			if ($examen[examen_tipo] == "MANEJO")
				$nmanejo += 1;
			if ($examen[examen_tipo] == "MECANICO")
				$nmecani += 1;
		}
		$tbody .=
		"<input type='button' id='reprogramar_".$examen['pk_examen']."' value='REPROGRAMAR'".
		"onClick='reprogramarExamen($examen[pk_examen],$_POST[pk_tramite])' ".$disabled."> ".
		"</td></tr>";
	}
	if (!$reglas && !$manejo && !$mecanico)
		$nuevo = "disabled='disabled'";
	if ($nreglas == 3 || $nmecani == 3 || $nmanejo == 3)
		$nuevo = "disabled='disabled'";
	
	$tbody .= "</tbody>";
	$tfoot =
	"<tfoot>
	<tr>
		<td colspan='5'>
		<input type='button' id='agregar_examen' value='+EXAMEN' 
		onClick=\"$('#new_ex".$_POST['pk_tramite']."').toggle();\" ".$nuevo."/>
		</td>
	</tr>";
	$tfoot .=
	"<tr id='new_ex".$_POST['pk_tramite']."' style='display:none;'>".
		"<td>";
	if ($reglas || $manejo || $mecanico){
		$tfoot .= "<select name='examen_tipo' id='examen_tipo'>";
			if ($reglas)
				$tfoot .= "<option value='REGLAS'>REGLAS</option>";
			if ($manejo)
				$tfoot .= "<option value='MANEJO'>MANEJO</option>";
			if ($mecanico)
				$tfoot .= "<option value='MECANICO'>MECANICO</option>";
		$tfoot .= "</select>";
	}
	$tfoot .=
		"</td><td>".
			"<input type='text' name='examen_fecha' id='examen_fecha' size='8' readonly class='datepicker'>".
		"</td><td>".
			"<input type='text' name='examen_puntaje' disabled='disabled' size='2'>".
		"</td><td>".
			"<input type='text' name='ESTADO' id='ESTADO'". 
			"disabled='disabled' value='PENDIENTE' size='8'>".
		"</td><td>".
			"<input type='button' id='grabar_examen' value='GRABAR'". 
			"onClick=\"grabarExamen('".$_POST['pk_tramite']."');\"/>".
		"</td>".
	"</tr>".
	"</tfood>";
	echo $thead." ".$tfoot." ".$tbody;
	$bbdd->close();

?>