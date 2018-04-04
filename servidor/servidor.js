//paquetes necesarios para el proyecto
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controlador = require('../servidor/controladores/controlador.js');
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/competencias', controlador.buscarTodasLasCompetencias);

app.post('/competencias', controlador.crearCompetencia);

app.get('/generos', controlador.cargarGeneros);

app.get('/actores', controlador.cargarActores);

app.get('/directores', controlador.cargarDirectores);

app.get('/competencias/:id/peliculas/', controlador.cargarCompetencia);

app.post('/competencias/:idCompetencia/voto', controlador.sumarVotoDePelicula);

app.get('/competencias/:id/resultados', controlador.devolverResultadoVotacion);

app.get('/competencias/:id', controlador.buscarCompetencia);

app.put('/competencias/:idCompetencia', controlador.editarCompetencia);

app.delete('/competencias/:idCompetencia/votos', controlador.reiniciarVotacion);

app.delete('/competencias/:idCompetencia', controlador.eliminarCompetencia);



//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = 8080,
      id = '127.0.0.1'

app.listen(puerto, id, function () {
  console.log( "Escuchando en el id: "+id+" y el puerto: " + puerto );
});
