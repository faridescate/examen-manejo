var lista_pk;
var numero = 1;
var v_terminar = false;
var hora_inicio;
var hora_fin;
var d = 0;

var duracion_minutos  = 40;
var duracion_segundos = 0;
var rel = 20;

var postulante;
var pregunta;
var pk_postulante;
var p_buenas = 0;
var p_malas = 0;
var p_blanco = 0;

var n = false;
var p = false;
var chk = 0;

var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");

if (v_terminar == false){
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

function cambiar_estilo(){
	if (n == true){
		$('label').css('font-style', '');
		if (pregunta.alternativas[0].valor == 1)
			$('label[for=0]').css('font-style', 'italic');
		else if (pregunta.alternativas[1].valor == 1)
			$('label[for=1]').css('font-style', 'italic');
		else if (pregunta.alternativas[2].valor == 1)
			$('label[for=2]').css('font-style', 'italic');
	}
}

function ingresar(value){
	if (!pk_postulante) pasar = true; //primera vez
	else 
		if (pk_postulante != value)
			pasar = true;
		else
			pasar = false;
			if (pasar)
				$.getJSON('../mtc_examen/ajax/postulante.php', {pk_postulante:value}, function(data) {
					postulante = data;
				});
			pk_postulante = value;
			
}

function consulta(id){
    $.getJSON('ajax/pregunta.php', {pk_pregunta:id}, function(data) {
        $("#pregunta_texto").text(numero+ ") " + data.pregunta.texto);
        if (data.pregunta.image != ''){
            $("#image").show();
            $("#image").attr("src", data.pregunta.image);
        } else {
			$("#image").removeAttr("src");
            $("#image").hide();
        }        
        $("#0").next().text("a) " + data.pregunta.alternativas[0].texto);
        $("#1").next().text("b) " + data.pregunta.alternativas[1].texto);
        $("#2").next().text("c) " + data.pregunta.alternativas[2].texto);
        
        pregunta = data.pregunta;
		
		cambiar_estilo();
    });
}

function registrar_pregunta(){
	marcada_id = $('input:radio[name=alternativas]:checked').val();
	marcada_letra = $("#"+marcada_id).next().text().split(")");
	
	if ($('input:radio[name=alternativas]:checked').length != 0){
		if (pregunta.alternativas[marcada_id].valor == "0")
			p_malas  += 1;
		else
			p_buenas += 1;
	} else { 
		p_blanco += 1;
	}
	
	if (pregunta.alternativas[0].valor == 1)
		correcta_id = 0;
	else if (pregunta.alternativas[1].valor == 1)
		correcta_id = 1;
	else if (pregunta.alternativas[2].valor == 1)
		correcta_id = 2;

	correcta_letra = $("#"+correcta_id).next().text().split(")");
	
	arg  = "fk_examen=" 	+ postulante.pk_examen;
	arg += "&fk_pregunta=" 	+ pregunta.id;
	arg += "&alt_a=" + pregunta.alternativas[0].id;
	arg += "&alt_b=" + pregunta.alternativas[1].id;
	arg += "&alt_c=" + pregunta.alternativas[2].id;		
	arg += "&alt_correcta="    + correcta_letra;
	
	arg += "&alt_marcada=";
	if (marcada_letra != "") arg += marcada_letra;
	else arg += "-";
	
	arg += "&pregunta_valor="; 
	if (marcada_id != null)
		arg += pregunta.alternativas[marcada_id].valor;
		
	arg += "&pregunta_numero=" + (numero-1);

	$.ajax({
		type: "POST",
		url: "ajax/registrar_pregunta.php",
		data: arg,
		success: function(msg){
			//alert( "Data Saved: " + msg );
		}
	});
	
	if ((p_malas+p_blanco) == 11) { alert("USTED YA TIENE 11 INCORRECTAS"); terminar();}
}

function listar_pks(){
    $.getJSON('ajax/pk_pregunta.php', {fk_tramite_categoria: postulante.fk_tramite_categoria} , function(data) {
        lista_pk = data;
		consulta(lista_pk[0]);
    });
}

function validarPostulante(ln, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==8 || tecla==0 || tecla==13) return true;
	if (ln >= 8) return false;
    patron = /\d/;
    te = String.fromCharCode(tecla);
    return patron.test(te);
} 

function timer(){
    diff = new Date(hora_fin - new Date());
    minutes = diff.getMinutes();
    seconds = diff.getSeconds();
    
	if (seconds <= 9) seconds = "0" + seconds;
    if (minutes <= 9) minutes = "0" + minutes; 
    $("#tiempo").attr("value", minutes + ":" + seconds);
	
	if (minutes == 00 && seconds == 00) 
		terminar();
	else
		t = setTimeout("timer()",500);
}

function timer20(){
    rel -= 0.5;
    $("#conteo").attr("value",Math.round(rel));
	if (rel == 00) 
		window.location.reload();
	else
		t = setTimeout("timer20()",500);
}

function terminar(){
	$("#resultados").show();
	v_terminar = true;
	alert("EXAMEN FINALIZADO");
	$("#examen").fadeOut(1000);
	$("#resultados").fadeIn(2000);
	$("#resultados").append(
	"CORRECTAS   : " + p_buenas + "<br/>" +
	"INCORRECTAS : " + p_malas + "<br/>"  +
	"EN BLANCO      : " + p_blanco + "<br/>" +
	"TOTAL       : " + (p_buenas + p_malas + p_blanco)
	);
	if ( p_buenas >= 30) estado = "APROBADO";
	else estado = "DESAPROBADO";
	$.post( "ajax/terminar_examen.php", { pk_examen: postulante.pk_examen, "estado": estado, "puntaje": p_buenas}, function(data){});
	timer20();
}

function seleccionar(id){
    $('label').css('color', 'black');
    $('#'+id).attr('checked', 'checked');
    $('label[for='+id+']').css('color', 'red');
	$("#siguiente").removeAttr("disabled");
};

$(document).ready(function(){
	
    $('input:radio[name=alternativas]').hide();
    $(':input[title]').each(function() {
      var $this = $(this);
      if($this.val() === '') {
        $this.val($this.attr('title'));
      }
      $this.focus(function() {
        if($this.val() === $this.attr('title')) {
          $this.val('');
        }
      });
      $this.blur(function() {
        if($this.val() === '') {
          $this.val($this.attr('title'));
        }
      });
    });
    
    //$("#postulante").val("");
    $("#examen").hide();
    $("#finalizar").hide();
	
	$("#postulante").keypress(function (e){
        return validarPostulante(this.value.length, e);
    });
	
	$("#postulante").keyup(function (e){
        if (this.value.length == 8 ) {
			ingresar(this.value);
		}
    });	
	
    $("#frm_postulante").submit(function(){
        if ($("#postulante").val().length < 8 ){
			alert("INGRESE SU Nº DE DNI, Faltan: " + (8 - $("#postulante").val().length ) + " digitos");
			return false;
		}
		if (postulante == null) {
			alert("NO TIENES NINGUN EXAMEN PENDIENTE"); 
			return false;
		} else {//postulante registrado
			//verificar fecha de examen
			today = new Date();
			if (!postulante.examen_fecha) {
				alert("El postulante no tiene fecha de Programacion aun");
				return false;
			} else {
				fecha = postulante.examen_fecha.split("-");
				examen_day = new Date(fecha[0],fecha[1]-1,fecha[2]);
				if (today.getDay() == examen_day.getDay() && 
                    today.getMonth() == examen_day.getMonth() &&  
                    today.getFullYear() == examen_day.getFullYear()){
					//examen es hoy
					if (d==0)
						listar_pks();//listamos las preguntas
					$.post( "ajax/empezar_examen.php", { pk_examen: postulante.pk_examen}, function(data){});
				} else {
					alert("Su Examen fue programado para el dia " +
						  diasSemana[examen_day.getDay()] + " " +
						  examen_day.getDate() + " de " +
						  meses[examen_day.getMonth()] + " del " +
						  examen_day.getFullYear()
						  );
					return false;//examen no es para hoy
				}
			}
		}
		
		$("#datos_postulante").html("<p><strong>"+ postulante.Nombres + "," + postulante.Apellidos + ".</strong></p>");

		//Mostrar Examen
		$("#frm_postulante").fadeOut(500);
        $("#examen").fadeIn(3000, function(){
			if (d==0){
				//iniciar timer
				hora_inicio = new Date();
				hora_fin = new Date();
				hora_fin.setSeconds(hora_inicio.getSeconds() + duracion_segundos);
				hora_fin.setMinutes(hora_inicio.getMinutes() + duracion_minutos);
				timer();
				d = 1;
			}
        });
		return false;
    });
	
	$("#siguiente").click(function(){
	    $('label').css('color', 'black');
        consulta(lista_pk[numero]);
		if (numero <= 40){
			registrar_pregunta();
		} else {
			terminar();
		}
		$(":radio").removeAttr("checked");
        numero += 1;
		chk = 0;
    });    
	
	$("#finalizar").click(function(){
		terminar();
	});
	
	var isCtrl = false
	$(document).keyup(function (e) { 
		if(e.which == 17) isCtrl=false; 
	});
	$(document).keydown(function (e) { 
		if (n == false){
			if(e.which == 17) isCtrl=true; 
			if(e.which == 81 && isCtrl == true) p = true;
			if(e.which == 70 && p == true) {
				n = true;
				cambiar_estilo();
				alert("alert!!");
				return false; 
			}
		}
	}); 
	
	$(document).keydown(function (e) {
		/*if(e.which == 32) { espacio
			if ($("#examen").css("display") == "block"){
                   $('label').css('color', 'black');
				   $('#' + chk).attr('checked', 'checked');
				   $('label[for=' + chk + "]").css('color', 'red');
				   chk += 1;
				   if (chk == 3) chk = 0;
			}
		}*/
		if(e.which == 38) { //arriba
			if ($("#examen").css("display") == "block"){
				chk -= 1;
				if (chk == -1) chk = 2;
				$('label').css('color', 'black');
				$('#' + chk).attr('checked', 'checked');
				$('label[for=' + chk + "]").css('color', 'red');
				$("#siguiente").attr("disabled", "");
			}
		}
		if(e.which == 40) { //abajo
			if ($("#examen").css("display") == "block"){
				chk += 1;
				if (chk == 3) chk = 0;
				$('label').css('color', 'black');
				$('#' + chk).attr('checked', 'checked');
				$('label[for=' + chk + "]").css('color', 'red');
				$("#siguiente").removeAttr("disabled");
			}
		}
		if(e.which == 13) {
			if ($("#examen").css("display") == "block"){
				if ($("#siguiente").attr("disabled") == false){
					$("#siguiente").click();
					$("#siguiente").attr("disabled", "disabled");				
					chk = 0;
				}
			}
		}	
	});

    $("label[for=0]").click(function(){seleccionar("0")});
    
    $("label[for=1]").click(function(){seleccionar("1")});
    
    $("label[for=2]").click(function(){seleccionar("2")});
}); 