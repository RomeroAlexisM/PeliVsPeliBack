// Al finalizarse de cargar el DOM:
$(function() {
	var competenciasController = new CompetenciasController();
	// Se obtienen y cargan los géneros, directores/as y actores/actrices en los elementos select
	competenciasController.cargarGeneros();
	competenciasController.cargarDirectores();
	competenciasController.cargarActores();
	// var opcion = document.getElementsByName("opcion")
	// console.log(opcion.length);
	// for (var i = 0; i < opcion.length; i++) {
	// 		if (opcion[i].checked) {
	// 			console.log(opcion[i].value);
	// 		}
	// }
	// function habilitar(value)
	// 		{
	// 			if(value=="1")
	// 			{
	// 				// habilitamos
	// 				document.getElementById("segundo").disabled=false;
	// 			}else if(value=="2"){
	// 				// deshabilitamos
	// 				document.getElementById("segundo").disabled=true;
	// 			}
	// 		}
	// Al enviarse el formulario, se debe ejecutar un POST al servidor
	$("#formCompetencia").ajaxForm({url: server + '/competencias', type: 'post',
		// En caso de éxito, se redirige a index.html
		success: function(res) {
			window.location.replace("./index.html?exito=True");
		},
		// En caso de error por validación, se muestra el mensaje de error en el contenedor para tal fin
		error: function(response, status, xhr) {
			if (response.status == 422){
				$("#mensajeDeError").text(response.responseText);
			}
		}

	});
	// Si el usuario cancela, se redirige a index.html
	$(".cancelar").click(function(){
		window.location.replace("./index.html");
	});
});
