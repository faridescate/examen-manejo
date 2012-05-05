var load_image = 
"<center id='load_image'>"+
    "<image src='../mtc_examen/css/ajax-loader.gif' alt='loading'"+
"</center>";
var pk_postulante;
var min, max;
function buscarPostulante(dni){
	if (dni != pk_postulante){ 
		if ($("#load_image").length == 0)
			$("body").append(load_image);
		$.getJSON('../mtc_examen/Modulos/Ventanilla/ver_postulante.php', {pk_postulante:dni}, 
		function(data) {
			if (data){
				$("#nombre").css('color','black');
				$("#apellidos").css('color','black');
				$("#nombre").val(data.Nombres);
				$("#apellidos").val(data.Apellidos);
				$("#editar_postulante").show();
				mostrarTramites(dni);
			} else {
				$("#nombre").attr("disabled","");
				$("#apellidos").attr("disabled","");
				$("#grabar_postulante").show();
				$("#grabar_postulante").attr("disabled","");
				$("#nuevo_tramite").attr("disabled","");
				$("#load_image").remove();
		   }
		});
		pk_postulante = dni;
	}
}

function mostrarTramites(dni){
		$("#tramite")
		.load("../mtc_examen/Modulos/Ventanilla/ver_tramite.php", 
		{ 'fk_postulante': dni }, 
		function(){
			$('#tramite').show();
			$("#load_image").remove();
			$("#tramite_examen_medico").datepicker({
				minDate:-180,
				maxDate:0,
				changeMonth: true,
				changeYear: true,
				dateFormat: "dd-mm-yy",
				showOtherMonths: true,
				selectOtherMonths: true
			});
		}
		);
	return true;
}

function mostrarExamenes(tramite){
	today = new Date();
	if (today.getHours() >= 12){
		min =  1;
		max = 91;
	} else {
		min =  0;
		max = 90;
	}
	if ($("#detalle_"+tramite).css("display") == "none"){
		if ($("#load_image").length == 0)
		$("body").append(load_image);	
		$("#table_"+tramite)
		.load("../mtc_examen/Modulos/Ventanilla/ver_examenes.php", 
		{ 'pk_tramite': tramite }, 
		function(){
			$(".tramite_detalle").hide();
			$("#detalle_"+tramite).show();
			$("#load_image").remove();
			$(".datepicker").datepicker({
				minDate:min,
				maxDate:max,
				changeMonth: true,
				changeYear: true,
				dateFormat: "dd-mm-yy",
				showOtherMonths: true,
				selectOtherMonths: true
			});
			}
		);
	} else {
		$("#detalle_"+tramite).hide();
	}
}

function nuevoTramite(){
	if ($("#tr_nuevo_tramite").css("display") == "none"){
		$("#tr_nuevo_tramite").show();
		$("#grabar_tramite").show();
		$("#cancelar_tramite").show();
		$("#nuevo_tramite").hide();
	} else {
		$("#tr_nuevo_tramite").hide();
		$("#grabar_tramite").hide();
		$("#cancelar_tramite").hide();
		$("#nuevo_tramite").show();
	}
}

function grabarTramite(){
	if (!$("#codigo_registro").val())
		alert("Ingrese codigo de registro");
	else if (!$("#tramite_examen_medico").val())
		alert("Ingrese la fecha de examen medico")
	else
	$.post("../mtc_examen/Modulos/Ventanilla/registrar_tramite.php", 
		{
			"fk_postulante": $("#fk_postulante").val(),
			"ESTADO": $("#ESTADO").val(),
			"codigo_registro": $("#codigo_registro").val(),
			"tramite_examen_medico": $("#tramite_examen_medico").val(),
			"tramite_tipo_licencia": $("#tramite_tipo_licencia").val(),
			"tramite_tipo": $("#tramite_tipo").val(),
		},function (data){ 
			alert("Tramite Guardado");
			pk_postulante = "";
			mostrarTramites($("#fk_postulante").val());
		}
	);
}

function reprogramarExamen(pkExamen, pkTramite){
	fecha = $("#"+pkExamen).find(".lbl_fecha").html();
	today = new Date();
	if (today.getHours() >= 12){
		min =  1;
		max = 91;
	} else {
		min =  0;
		max = 90;
	}
	if ($("#reprogramar_"+pkExamen).val() == "REPROGRAMAR"){
		$("#"+pkExamen).find(".lbl_fecha").html("<input type='text' size='7' value='"+fecha+"'name='n_fecha' id='n_fecha' class='datepicker'/>");
		$("#reprogramar_"+pkExamen).val("GRABAR");
		$(".datepicker").datepicker({
				minDate:min,
				maxDate:max,
				changeMonth: true,
				changeYear: true,
				dateFormat: "dd-mm-yy",
				showOtherMonths: true,
				selectOtherMonths: true
			});
	} else {
		
	}
	return true;
}

function grabarExamen(pk_tramite){
	$.post("../mtc_examen/Modulos/Ventanilla/registrar_examen.php", 
		{
			"fk_tramite": pk_tramite,
			"examen_fecha": $("#examen_fecha").val(),
			"examen_tipo": $("#examen_tipo option:selected").val()
		}, 
		function (data){ 
			$("#detalle_"+pk_tramite).css("display", "none");
            mostrarExamenes(pk_tramite);
			alert("Examen Guardado");
		}
	);
}

function soloNumero(ln, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==31) return false;
	//if (ln == 8) return false;
    patron = /\d/;
    te = String.fromCharCode(tecla);
    return patron.test(te);
}

$(document).ready(function(){
	$(".n_opciones").hide();
	$('#tramite').hide();
	$(function() {
			$.datepicker.setDefaults( $.datepicker.regional[ "es" ] );
	});
	
	$("#dni").keypress(function (e){
        return soloNumero(this.value.length, e);
    });
	
	$("#dni").keyup(function (e){
        if ($("#dni").val().length == 8){
			buscarPostulante($("#dni").val());
			return false;
		} else {
			$("#apellidos").val("");
			$("#nombre").val("");
			$("#editar_postulante").hide();
			$("#grabar_postulante").hide();
			$('#tramite').hide();
			$("#nombre").attr("disabled","disabled");
            $("#apellidos").attr("disabled","disabled");
			pk_postulante = "";
		}
	});
	
	$("#editar_postulante").click(function (){
		if ($("#editar_postulante").val() == "EDITAR"){
			$("#nombre").attr("disabled","");
			$("#apellidos").attr("disabled","");
			$("#editar_postulante").val("ACTUALIZAR");
		} else if ($("#editar_postulante").val() == "ACTUALIZAR") {
			$.post("../mtc_examen/Modulos/Ventanilla/actualizar_postulante.php", 
			  {
				"pk_postulante" : $("#dni").val(),
				"nombres" : $("#nombre").val(),
				"apellidos" : $("#apellidos").val()
			  },function (data){ 
				alert("Datos actualizados");
				pk_postulante = "";
				buscarPostulante($("#dni").val());
			  }
			);
			$("#nombre").attr("disabled","disabled");
			$("#apellidos").attr("disabled","disabled");
			$("#editar_postulante").val("EDITAR");
		}
	});
});


