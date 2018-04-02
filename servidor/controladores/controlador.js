var conexion = require('../baseDeDatos/conexionDB.js');
var competenciaSeleccionada;

function buscarTodasLasCompetencias(req, res){
  var sql = "select * from competencia";
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    res.send(JSON.stringify(resultado));
  });
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

  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la insercion de datos", error.message);
      return res.status(505).send("Hubo un error en la insercion de datos");
    }
    res.json(resultado);
  });
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

// function crearCompetencia(req, res){
//   var sql = "INSERT INTO competencia (nombre) VALUES ("++")";
// }

function cargarGeneros(req, res){
  var sql = "Select * from genero";
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    res.send(JSON.stringify(resultado));
  });
}

function cargarActores(req, res){
  var sql = "Select * from actor";
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    // var response = {
    //   'actores': resultado,
    // }
    res.send(JSON.stringify(resultado));
  });
}

function cargarDirectores(req, res){
  var sql = "Select * from director";
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    // var response = {
    //   'directores': resultado,
    // }
    res.send(JSON.stringify(resultado));
  });
}

module.exports = {
    buscarTodasLasCompetencias: buscarTodasLasCompetencias,
    obtenerPeliculasAleatorias: obtenerPeliculasAleatorias,
    sumarVotoDePelicula: sumarVotoDePelicula,
    devolverResultadoVotacion: devolverResultadoVotacion,
    cargarGeneros: cargarGeneros,
    cargarActores: cargarActores,
    cargarDirectores: cargarDirectores
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
