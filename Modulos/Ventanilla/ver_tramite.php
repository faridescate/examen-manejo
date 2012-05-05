<?php
	require_once($_SERVER[DOCUMENT_ROOT]."mtc_examen/conexion/bbdd.php");
	$none = "style='display:none'";
	$sql = 
	"SELECT `pk_tramite`, `fk_tramite_categoria`, `tramite_fecha`, "
	. "`ESTADO`, DATE_FORMAT(`tramite_examen_medico`, '%d-%m-%Y') as 'tramite_examen_medico', `codigo_registro`, "
	. "`tramite_tipo_licencia`, `tramite_tipo` "
	. "FROM `postulante_tramite` "
	. "WHERE `postulante_tramite`.`fk_postulante` = '$_POST[fk_postulante]' ORDER BY `ESTADO`\n";
	
	$result = $bbdd->query($sql);
	$tramites = array();
	$tramite_head =
	'<thead>
		<tr>
			<th scope="col">COD. REG.</th>
			<th scope="col">TIPO</th>
			<th scope="col">EX. MEDICO</th>
			<th scope="col">CATG.</th>
			<th scope="col">ESTADO</th>
		</tr>
	</thead>';
	$tramite_body = "<tbody id='tramite_body'>";	
	while($tramite = $result->fetch_assoc()){
		$tramite_body .= 
		"<tr id='$tramite[pk_tramite]' onClick='mostrarExamenes(this.id)'>
			<td class='T_codigo'>$tramite[codigo_registro]</td>
			<td class='T_tipo'>$tramite[tramite_tipo]</td>
			<td class='T_examenMedico'>$tramite[tramite_examen_medico]</td>
			<td class='T_categoria'>$tramite[fk_tramite_categoria]</td>
			<td class='T_estado'>$tramite[ESTADO]</td>
		</tr>
		<tr id='detalle_".$tramite['pk_tramite']."' class='tramite_detalle' style='display:none;'>
			<td colspan='5'>
				<fieldset>
					<legend>EXAMEN</legend>
						<table id='table_".$tramite[pk_tramite]."' border='0'>
						</table>
				</fieldset>
			</td>
		</tr>";
		if ($tramite['ESTADO'] == 'PENDIENTE')
			$disabled = 'disabled="disabled"';
		else 
			$disabled = '';
	}
	$tramite_body .= "</tbody>";
	$tramite_foot =
	"
	<tfoot>
	<tr id='tr_nuevo_tramite' ".$none.">".
			"<td>
				<input type='text' name='codigo_registro' id='codigo_registro' size='6' maxlength='8'/>
				<input type='hidden' name='fk_postulante' id='fk_postulante' value='$_POST[fk_postulante]'/>
			</td>".
			"<td>".
			"<select name='tramite_tipo' id='tramite_tipo'>".
				"<option value='NUEVA LICENCIA'>NUEVA LICENCIA</option>".
				"<option value='RECATEGORIZACION'>RECATEGORIZACION</option>".
				"<option value='REVALIDACION'>REVALIDACION</option>".
			"</select>".
			"</td>".
			"<td>".
			"<input type='text' name='tramite_examen_medico' id='tramite_examen_medico' size='9'/>".
			"</td>".
			"<td>".
			"<select name='tramite_tipo_licencia' id='tramite_tipo_licencia'>".
				"<option value='A1'>A1</option>".
				"<option value='A2a'>A2a</option>".
				"<option value='A2b'>A2b</option>".
				"<option value='A3a'>A3a</option>".
				"<option value='A3b'>A3b</option>".
				"<option value='A3c'>A3c</option>".
			"</select>".
			"</td>".
			"<td>".
			"<input type='text' name='ESTADO' id='ESTADO' value='PENDIENTE' readonly size='8'/>".
			"</td>".
		"</tr>";
	$tramite_foot .=
		'<tr>
			<td colspan="5">
				<input type="button" name="nuevo_tramite" id="nuevo_tramite" 
				value="+TRAMITE" '.$disabled.' onClick="nuevoTramite()"/>
				<input type="button" name="grabar_tramite" id="grabar_tramite" value="GRABAR" '.$none.' onClick="grabarTramite()"/>
				<input type="button" name="cancelar_tramite" id="cancelar_tramite" value="CANCELAR" '.$none.' onClick="nuevoTramite()"/>
			</td>
		</tr>
	</tfoot>';
	echo $tramite_head." ".$tramite_foot." ".$tramite_body;
$bbdd->close();
?>