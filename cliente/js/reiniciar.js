// Al finalizarse de cargar el DOM:
$(function() {
	// Se obtiene el id en la URL usando la función en helpers.js
	var idCompetencia = getQueryParam("id");
	// Se obtiene del backend el detalle de la competencia actual
	var competenciasController = new CompetenciasController();
		competenciasController.obtenerCompetencia(idCompetencia)
	// Al enviarse el formulario, se debe ejecutar un DELETE al servidor

	$("#formCompetencia").ajaxForm({url: server + '/competencias/'+idCompetencia+'/votos', type: 'delete',
		// En caso de éxito, se redirige a index.html
		success: function(res) {
			document.getElementById("confirmarReiniciar").style.visibility = "visible";
			document.getElementById("contenedorForm").className += "bloquearArea";
 			document.getElementById("botonR").setAttribute('disabled','disabled');
			document.getElementById("botonC").setAttribute('disabled','disabled');
			reiniciarApariciones(idCompetencia);
			// window.location.replace("./index.html?exito=True");
		},
		// En caso de error, se muestra el mensaje de error en el contenedor para tal fin
		error: function(response, status, xhr) {
			$("#mensajeDeError").text(response.responseText);
		}
	});

	// Si el usuario cancela, se redirige a index.html
	$(".cancelar").click(function(){
		window.location.replace("./index.html");
	});

});

function reiniciarApariciones(idCompetencia){
	// Al enviarse el formulario, se debe ejecutar un DELETE al servidor
	$("#formCompetencia").ajaxForm({url: server + '/competenciasApariciones/'+idCompetencia+'/votos', type: 'delete',
		// En caso de éxito, se redirige a index.html
		success: function(res) {
			document.getElementById("confirmarReiniciar").style.visibility = "hidden";
			document.getElementById("contenedorForm").className -= "bloquearArea";
			document.getElementById("botonR").setAttribute('disabled','false');
			document.getElementById("botonC").setAttribute('disabled','false');
			window.location.replace("./index.html?exito=True");
		},
		// En caso de error, se muestra el mensaje de error en el contenedor para tal fin
		error: function(response, status, xhr) {
			$("#mensajeDeError").text(response.responseText);
		}
	});

};
