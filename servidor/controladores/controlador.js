var conexion = require('../baseDeDatos/conexionDB.js');
var competenciaSeleccionada;

function buscarTodasLasCompetencias(req, res){
  var sql = "select * from competencia";
  buscarDatosEnBD(sql, res);
}

function obtenerPeliculasAleatorias(req, res){
  var idCompetencia = req.params.id;
  var sql = "select pelicula.id, pelicula.poster, pelicula.titulo from pelicula order by rand() limit 2;";
  buscarCompentecia(idCompetencia, res);
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    if (competenciaSeleccionada != null) {
      var response = {
        'peliculas': resultado,
        'competencia': competenciaSeleccionada
      }
      guardarPeliculaOfrecida(response);
      res.send(JSON.stringify(response));
    }
  });
}

function sumarVotoDePelicula(req, res){
  var idCompetencia = req.params.idCompetencia;
  var idPelicula = req.body.idPelicula;
  var sql = "INSERT INTO voto (competencia_id, pelicula_id) VALUES ("+idCompetencia+", "+idPelicula+")";
  cargarDatosEnBD(sql, res);
}

function devolverResultadoVotacion(req, res){
var idCompetencia = req.params.id;
var sql= "select competencia.nombre, pelicula.id, pelicula.titulo, pelicula.poster, count(voto.pelicula_id) as votos from voto, pelicula, competencia where pelicula.id = voto.pelicula_id and competencia.id = voto.competencia_id and competencia.id = "+idCompetencia+" group by voto.pelicula_id  order by votos desc limit 3";
conexion.query(sql, function(error, resultado, fields){
  if(error){
    console.log("Hubo un error en la consulta", error.message);
    return res.status(404).send("Hubo un error en la consulta");
  }
  var response = {
    'resultados': resultado,
    'competencia': resultado[0].nombre
  }
  res.send(JSON.stringify(response));
});
}

function crearCompetencia(req, res){
  var datosRecibidos = req.body;
  console.log(datosRecibidos);
  var nombreCompetencia = datosRecibidos.nombre;
  var actor = datosRecibidos.actor;
  var director = datosRecibidos.director;
  var genero = datosRecibidos.genero;
  var sql = "INSERT INTO competencia (nombre, genero, actor, director) VALUES ("+"'"+nombreCompetencia+"'"+","+genero+","+actor+","+director+")";
  cargarDatosEnBD(sql, res);
}

function cargarGeneros(req, res){
  var sql = "Select * from genero";
  buscarDatosEnBD(sql, res);
}

function cargarActores(req, res){
  var sql = "Select * from actor";
  buscarDatosEnBD(sql, res);
}

function cargarDirectores(req, res){
  var sql = "Select * from director";
  buscarDatosEnBD(sql, res);
}

module.exports = {
    buscarTodasLasCompetencias: buscarTodasLasCompetencias,
    obtenerPeliculasAleatorias: obtenerPeliculasAleatorias,
    sumarVotoDePelicula: sumarVotoDePelicula,
    devolverResultadoVotacion: devolverResultadoVotacion,
    cargarGeneros: cargarGeneros,
    cargarActores: cargarActores,
    cargarDirectores: cargarDirectores,
    crearCompetencia: crearCompetencia
  }

  function cargarDatosEnBD(sql, res){
    conexion.query(sql, function(error, resultado, fields){
      if(error){
        console.log("Hubo un error en la insercion de datos", error.message);
        return res.status(505).send("Hubo un error en la insercion de datos");
      }
      res.json(resultado);
    });
  }

  function buscarDatosEnBD(sql, res){
    conexion.query(sql, function(error, resultado, fields){
      if(error){
        console.log("Hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
      }
      res.send(JSON.stringify(resultado));
    });
  }

function guardarPeliculaOfrecida(datosPelicula){
  var idCompetencia = datosPelicula.competencia[0].id;
  var idPelicula1 = datosPelicula.peliculas[0].id;
  var idPelicula2 = datosPelicula.peliculas[1].id;
  var sql = "INSERT INTO pelicula_ofrecida (competencia_id, pelicula1_id, pelicula2_id) VALUES ("+idCompetencia+", "+idPelicula1+","+idPelicula2+")";
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la insercion de datos", error.message);
    }
  });

}

function buscarCompentecia(id, res){
  var sql = "select * from competencia where id="+id;
  conexion.query(sql, function(error, resultado, fields){
    if (resultado.length == 0) {
      competenciaSeleccionada = null;
      console.log("La competencia no existe");
      return res.status(404).send("La competencia no existe");

    }else {
      competenciaSeleccionada = resultado;
    }
  });
}
