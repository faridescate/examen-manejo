var pk_postulante;
var fk_postulante;
var nuevo_tramite = true;

var nuevo_reglas = true;
var nuevo_manejo = true;
var nuevo_mecanico = true;

var load_image = 
"<center>"+
    "<image id='load_image' src='../mtc_examen/css/ajax-loader.gif' alt='loading'"+
"</center>";

today = new Date();
if (today.getHours() >= 12){
	var min =  1;
	var max = 91;
} else {
	var min =  0;
	var max = 90;
}
			
function validarDni(ln, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==8 || tecla==0 || tecla==13) return true;
	//if (ln >= 8) return false;
    patron = /\d/;
    te = String.fromCharCode(tecla);
    return patron.test(te);
}
function buscarPostulante(dni){
    if ($("#load_image").length == 0)
        $("body").append(load_image);
    $.getJSON('../mtc_examen/ajax/mod_registro_postulante/postulante.php', {pk_postulante:dni}, function(data) {
        if (data){
			$("#nombre").css('color','black');
			$("#apellidos").css('color','black');
            $("#nombre").val(data.Nombres);
            $("#apellidos").val(data.Apellidos);
			buscarTramite(dni);
        } else {
            $("#nombre").attr("disabled","");
            $("#apellidos").attr("disabled","");
			$("#grabar_postulante").attr("disabled","");
			$("#nuevo_tramite").attr("disabled","");
			$("#load_image").remove();
       }
    });
    
}

function buscarTramite(dni){
	nuevo_tramite = true;
	$("#nuevo_tramite").attr("disabled", "");
	$.getJSON('../mtc_examen/ajax/mod_registro_postulante/tramite.php', {pk_postulante:dni}, function(data) {
       pk_tramite = "";
		if (data){
			fk_postulante = dni;
			fila = "<tbody>";
			for (var p in data){
			 pk_tramite = data[p].pk_tramite;
				fila += 
				"<tr id='"+data[p].pk_tramite+"' onClick='mostrar_examenes(this.id)'>"+
					"<td>"+data[p].codigo_registro+"</td>"+
					"<td>"+data[p].tramite_tipo+"</td>"+
					"<td>"+data[p].tramite_examen_medico+"</td>"+
					"<td>"+data[p].fk_tramite_categoria+"</td>"+
					"<td>"+data[p].ESTADO+"</td>"+
				"</tr>";
				fila += 
				"<tr id='tr_"+data[p].pk_tramite+"' style='display:none;'>"+
					"<td colspan='5'>"+
					"<fieldset>"+
						"<legend>EXAMEN</legend>"+
						"<table id='table_"+data[p].pk_tramite+"' border='0'>"+
						"</table>"+
					"</fieldset>"+
					"</td>"+
				"</tr>";
				if (data[p].ESTADO == "PENDIENTE"){
					nuevo_tramite = false;
				}
			}
			fila += "</tbody>";
            $('#tramite').fadeIn();
            $("#load_image").remove();
			if (typeof data[0] != "undefined")
				if ($("#"+data[0].pk_tramite).length == 0)
					$('#tramite').append(fila);
		}
        $("#nuevo_tramite").show();
        if (nuevo_tramite == false)
            $("#nuevo_tramite").attr("disabled", "disabled");
	});
}
function mostrar_examenes(pk_tramite){
	if ($("#tr_"+pk_tramite).css("display") == "none"){
        if ($("#load_image").length == 0)
            $("body").append(load_image);
        i_manejo = i_reglas = i_mecanico = 0;
		$.getJSON('../mtc_examen/ajax/mod_registro_postulante/examen.php', {"pk_tramite":pk_tramite},
		function(data){
			nuevo_reglas = true;
            nuevo_manejo = true;
            nuevo_mecanico = true;
			if(data){
				detalle = 
				"<thead>"+
					"<th>TIPO</th>"+
					"<th>FECHA</th>"+
					"<th>PUNTAJE</th>"+
					"<th>ESTADO</th>"+
					"<th>OPCION</th>"+
				"</thead>"+
				"<tfoot><tr>"+
					"<td colspan='5'>"+
						"<input type='button' id='agregar_examen' value='+EXAMEN' onClick='fagregar_examen();'/>"+
					"</td>"+
				"</tr></tfood>"+
				"<tbody>";
				for(var e in data){
					detalle +=
					"<tr id='"+data[e].pk_examen+"'>"+
						"<td class='lbl_tipo'>"+data[e].examen_tipo+"</td>"+
						"<td class='lbl_fecha'>"+data[e].examen_fecha+"</td>"+
						"<td>"+data[e].examen_puntaje+"</td>"+
						"<td>"+data[e].ESTADO+"</td>"+
						"<td>";
                        if (data[e].ESTADO != "PENDIENTE"){
                            disabled = "disabled='disabled'"
                        } else {
                            disabled = "";
                        }
                        detalle +=
							"<input type='button' id='reprogramar_"+data[e].pk_examen+"' value='REPROGRAMAR' "+
							"onClick='reprogramar_examen(\""+data[e].pk_examen+"\",\""+pk_tramite+"\")'"+disabled+">"+
						"</td>"+
					"</tr>";
                    
                    if (data[e].examen_tipo == "REGLAS")
					   i_reglas += 1;
					if (data[e].examen_tipo == "MANEJO")
					   i_manejo += 1;
					if (data[e].examen_tipo == "MECANICO")
					   i_mecanico += 1;
                       
					if (data[e].ESTADO == "PENDIENTE" || data[e].ESTADO == "APROBADO"){
						if (data[e].examen_tipo == "REGLAS")
							nuevo_reglas = false;
						if (data[e].examen_tipo == "MANEJO")
							nuevo_manejo = false;
						if (data[e].examen_tipo == "MECANICO")
							nuevo_mecanico = false;
					}
				}
                if (i_reglas >= 3) nuevo_reglas = false;
                if (i_manejo >= 3) nuevo_manejo = false;
                if (i_mecanico >= 3) nuevo_mecanico = false;
				detalle += 
				"<tr id='tr_nuevo_examen' style='display:none;'>"+
					"<td>"+
						"<select name='examen_tipo'>"+
							"<option value='REGLAS'>REGLAS</option>"+
							"<option value='MANEJO'>MANEJO</option>"+
							"<option value='MECANICO'>MECANICO</option>"+
						"</select>"+
					"</td><td>"+
						"<input type='text' name='examen_fecha' id='examen_fecha' size='8' readonly>"+
					"</td><td>"+
						"<input type='text' name='examen_puntaje' disabled='disabled' size='2'>"+
					"</td><td>"+
						"<input type='text' name='ESTADO' id='ESTADO'"+ 
                        "disabled='disabled' value='PENDIENTE' size='8'>"+
					"</td><td>"+
						"<input type='button' id='grabar_examen' value='GRABAR'"+ 
                        "onClick='grabar_examen(\""+pk_tramite+"\");'/>"+
					"</td>"+
				"</tr>";
				detalle += "</tbody>";
			}
			$("#table_"+pk_tramite).html(detalle);
			$("#tr_"+pk_tramite).show();
			
			$("#examen_fecha").datepicker({
				minDate:min,
				maxDate:max,
				changeMonth: true,
				changeYear: true,
				dateFormat: "dd-mm-yy",
				showOtherMonths: true,
				selectOtherMonths: true
			});
            $("#load_image").remove();
            if (!nuevo_reglas && !nuevo_manejo && !nuevo_mecanico)
                $("#agregar_examen").attr("disabled","disabled");
		});
	} else {
		$("#tr_"+pk_tramite).hide();
		$("#table_"+pk_tramite).html("");
	}
}
function fagregar_examen(){
	if (!nuevo_reglas)
		$("option[value='REGLAS']").remove();
	if (!nuevo_manejo)
		$("option[value='MANEJO']").remove();
	if (!nuevo_mecanico)
		$("option[value='MECANICO']").remove();
	if (!nuevo_reglas && !nuevo_manejo && !nuevo_mecanico){
		$("#agregar_examen").attr("disabled","disabled");
        return false;
    }
	
    $("#tr_nuevo_examen").toggle();
    
	if ($("#tr_nuevo_examen").css("display") == "none")
		$("#agregar_examen").val("+EXAMEN");
	else {
		$("#agregar_examen").val("-EXAMEN");
	}		
}

function reprogramar_examen(pk_examen,pk_tramite){
	date = "";
	if ($("#reprogramar_"+pk_examen).val() == "REPROGRAMAR"){
		date = $("#"+pk_examen).find(".lbl_fecha").html();
		$("#"+pk_examen).find(".lbl_fecha").html("<input type='text' size='8' class='datepicker' id='input_examen' value='"+date+"' readonly/>");
		$(".datepicker").datepicker({
			minDate:min,
			maxDate:max,
			changeMonth: true,
			changeYear: true,
			dateFormat: "dd-mm-yy",
			showOtherMonths: true,
			selectOtherMonths: true
		})
		$("#reprogramar_"+pk_examen).val("GRABAR");
	} else {
		if ($("#reprogramar_"+pk_examen).val() == "GRABAR"){
			$.post("../mtc_examen/ajax/mod_registro_postulante/cambiar_fecha_examen.php", 
				{
					"pk_examen": pk_examen,
					"examen_fecha": $("#input_examen").val()
				}, 
				function (data){ 
				    $("#tr_"+pk_tramite).hide();
                    mostrar_examenes(pk_tramite);
					alert("Fecha Guardada");
				}
			);
		}
		date = $("#input_examen").val();
		$("#"+pk_examen).find(".lbl_fecha").html(date);
		$("#reprogramar_"+pk_examen).val("REPROGRAMAR");
	}
}


function grabar_examen(pk_tramite){
	$.post("../mtc_examen/ajax/mod_registro_postulante/registrar_examen.php", 
		{
			"fk_tramite": pk_tramite,
			"examen_fecha": $("#examen_fecha").val(),
			"examen_tipo": $("select option:selected").val()
		}, 
		function (data){ 
            $("#tr_"+pk_tramite).hide();
            mostrar_examenes(pk_tramite);
			alert("Examen Guardado");
		}
	);
}
$(document).ready(function(){
    
	$(function() {
			$.datepicker.setDefaults( $.datepicker.regional[ "es" ] );
	});
	
	$('#tramite').hide();
    $('#nuevo_tramite').hide();
	$('#grabar_tramite').hide();
	$('#cancelar_tramite').hide();
    $("#nombre").attr("disabled","disabled");
    $("#apellidos").attr("disabled","disabled");
    
	$("#frm_login").submit(function(){
		if ($("#usuario").val().lenght == 0 || $("#contraseña").val().length == 0 ){
			alert("Ingrese usuario y contraseña");
			return false;
		}
	});
	
	$("#dni").keypress(function (e){
        return validarDni(this.value.length, e);
    });
    pasar = 0;
    $("#dni").keyup(function (e){
		if (this.value.length == 8){
			if (pk_postulante != this.value){
				buscarPostulante(this.value);
				pk_postulante = this.value;
			}
	    } else {
			$("#nombre").val('Nombres');
			$("#apellidos").val('Apellidos');
			$("#nombre").css('color','gray');
			$("#apellidos").css('color','gray');
			$("#nombre").attr("disabled","disabled");
			$("#apellidos").attr("disabled","disabled");
			if (this.value.length <= 7){
				$('#tramite tbody').remove();
				$('#tramite').hide();
				pk_postulante = "";
			}
	   }
    });
	
    $("#nuevo_tramite").click(function(){
		if (nuevo_tramite == false) {
			if($("#nuevo_tramite").css("display") == "none"){
				alert("Debe culminar su --TRAMITE PENDIENTE-- antes de poder registrar otro");
				return false;
			}
		}
		nuevo = 
		"<tr id='tr_nuevo_tramite'>"+
			"<td><input type='text' name='codigo_registro' id='codigo_registro' size='6' maxlength='8'/></td>"+
			"<td>"+
			"<select name='tramite_tipo' id='tramite_tipo'>"+
				"<option value='NUEVA LICENCIA'>NUEVA LICENCIA</option>"+
				"<option value='RECATEGORIZACION'>RECATEGORIZACION</option>"+
				"<option value='REVALIDACION'>REVALIDACION</option>"+
			"</select>"+
			"</td>"+
			"<td>"+
			"<input type='text' name='tramite_examen_medico' id='tramite_examen_medico' size='9'/>"+
			"</td>"+
			"<td>"+
			"<select name='tramite_tipo_licencia' id='tramite_tipo_licencia'>"+
				"<option value='A1'>A1</option>"+
				"<option value='A2a'>A2a</option>"+
				"<option value='A2b'>A2b</option>"+
				"<option value='A3a'>A3a</option>"+
				"<option value='A3b'>A3b</option>"+
				"<option value='A3c'>A3c</option>"+
			"</select>"+
			"</td>"+
			"<td>"+
			"<input type='text' name='ESTADO' id='ESTADO' value='PENDIENTE' readonly size='8'/>"+
			"</td>"+
		"</tr>";
		$('#tramite').append(nuevo).fadeIn(1000);
		$('#nuevo_tramite').hide();
		$('#grabar_tramite').show();
		$('#cancelar_tramite').show();
		
		$("#tramite_examen_medico").datepicker({
			minDate:-180,
			maxDate:0,
			changeMonth: true,
			changeYear: true,
			dateFormat: "dd-mm-yy",
			showOtherMonths: true,
			selectOtherMonths: true
		});
	});
	
	$('#cancelar_tramite').click(function(){
		$('#tr_nuevo_tramite').remove();
		$('#grabar_tramite').hide();
		$('#cancelar_tramite').hide();
		$('#nuevo_tramite').show();
	});
    
    $(':input[title]').each(function() {
      var $this = $(this);
      if($this.val() === '') {
	    $this.css('color','gray');
        $this.val($this.attr('title'));
      }
      $this.focus(function() {
        if($this.val() === $this.attr('title')) {
		  $this.css('color','black');
          $this.val('');
        }
      });
      $this.blur(function() {
        if($this.val() === '') {
		  $this.css('color','gray')
          $this.val($this.attr('title'));
        }
      });
    });

	$('#grabar_postulante').click(function(){
		if ($("#load_image").length == 0)
            $("body").append(load_image);
		$.post("../mtc_examen/ajax/mod_registro_postulante/registrar_postulante.php", 
		{
			"pk_postulante": $("#dni").val(),
			"Nombres": $("#nombre").val(),
			"Apellidos": $("#apellidos").val()
		}, 
		function (data){ 
			alert("Postulante Guardado");
			$("#tramite").fadeIn(2000);
			$("#nombre").attr("disabled","disabled");
			$("#apellidos").attr("disabled","disabled");
			$("#grabar_postulante").attr("disabled","disabled");
			$("#nuevo_tramite").show();
			$("#load_image").remove();
			
		}
		);
	});
	
	$('#grabar_tramite').click(function(){
		$.post("../mtc_examen/ajax/mod_registro_postulante/registrar_tramite.php", 
		{
			"fk_postulante": fk_postulante,
			"ESTADO": $("#ESTADO").val(),
			"codigo_registro": $("#codigo_registro").val(),
			"tramite_examen_medico": $("#tramite_examen_medico").val(),
			"tramite_tipo_licencia": $("#tramite_tipo_licencia").val(),
			"tramite_tipo": $("#tramite_tipo").val(),
		}, 
		function (data){ 
			alert("Tramite Guardado");
			$("#cancelar_tramite").click();
			$("#tr_nuevo_tramite").remove();
			nuevo_tramite = true;
			buscarTramite(fk_postulante);
		}
		);
	});
});