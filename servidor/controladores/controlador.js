var conexion = require('../baseDeDatos/conexionDB.js');

function buscarTodasLasCompetencias(req, res){
  var sql = "select * from competencia";
  buscarDatosEnBD(sql, res);
}

function buscarCompentecia(req, res){
  var idCompetencia = req.params.id;
  var sql = "select * from competencia where id="+idCompetencia;
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    obtenerPeliculasAleatorias(resultado[0], res);
  });
}

function obtenerPeliculasAleatorias(resultado, res){
  var actor = resultado.actor;
  var director = resultado.director;
  var genero = resultado.genero;
  var nombreCompetencia = resultado.nombre;
  var sentencia = crearSqlObtenerPeliculas(actor, director, genero);
  var sql = "SELECT "+sentencia.select+" FROM "+sentencia.from+" where "+sentencia.where1+" and "+sentencia.where2+" ORDER BY rand() LIMIT 2";
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    var response = {
      'peliculas': resultado,
      'competencia': nombreCompetencia
    }
    guardarPeliculaOfrecida(response);
    res.send(JSON.stringify(response));
  });
}

function crearSqlObtenerPeliculas(actor, director, genero){
  var select = "pelicula.id, pelicula.poster, pelicula.titulo, actor.nombre, director.nombre, genero.nombre";
  var from = "pelicula, actor, director, genero, actor_pelicula, director_pelicula";
  var where1 = "actor_pelicula.actor_id =actor.id and actor_pelicula.pelicula_id = pelicula.id and pelicula.genero_id = genero.id  and director_pelicula.director_id = director.id and director_pelicula.pelicula_id= pelicula.id";
  var where2 = validarDatosCompetencia(actor, director, genero);
  var sentencia = {
    'select': select,
    'from': from,
    'where1': where1,
    'where2': where2
  }
  return sentencia;
}

function validarDatosCompetencia(actor, director, genero){
  if (actor != 0) {
    if (director != 0) {
      if (genero != 0) {
        return " actor.id ="+actor+" and director.id = "+director+" and genero.id = "+genero;
      }else {
        return " actor.id ="+actor+" and director.id = "+director;
      }
    }else {
      return " actor.id ="+actor;
    }
  }else if (director != 0) {
    if (genero != 0) {
      return " director.id = "+director+" and genero.id = "+genero;
    }else {
      return " director.id = "+director;
    }
  }else if (genero != 0) {
    return " genero.id = "+genero;
  }else {
    return "";
  }
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
    // obtenerPeliculasAleatorias: obtenerPeliculasAleatorias,
    buscarCompentecia: buscarCompentecia,
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
