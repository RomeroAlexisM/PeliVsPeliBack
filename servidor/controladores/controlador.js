var conexion = require('../baseDeDatos/conexionDB.js');

function buscarTodasLasCompetencias(req, res){
  var sql = "select * from competencia where estado = 1";
  buscarDatosEnBD(sql, res);
}

function buscarCompetencia(req, res){
  var idCompetencia = req.params.id;
  var sql = "select * from competencia where id="+idCompetencia;
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    buscarDatosDeCompetencia(idCompetencia, resultado[0], res);
  });
}

function buscarDatosDeCompetencia(idCompetencia, resultado, res){
  var actor_id = resultado.actor_id;
  var director_id = resultado.director_id;
  var genero_id = resultado.genero_id;
  var nombreCompetencia = resultado.nombre;
  var sql = crearSqlBuscarDatosDeCompetencia(idCompetencia, actor_id, director_id, genero_id);
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("aca Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    res.send(JSON.stringify(resultado[0]));
  });
}

function crearSqlBuscarDatosDeCompetencia(idCompetencia, actor_id, director_id, genero_id){
  if (existeElActor(actor_id)) {
    if (existeElDirector(director_id)) {
      if (existeElGenero(genero_id)) {
        return "select competencia.nombre, actor.nombre as actor_nombre, director.nombre as director_nombre, genero.nombre as genero_nombre"+
              " from competencia, actor, director, genero"+
              " where competencia.actor_id = actor.id and competencia.director_id = director.id and"+
              " competencia.genero_id = genero.id and competencia.id = "+idCompetencia;
      }else {
        return "select competencia.nombre, actor.nombre as actor_nombre, director.nombre as director_nombre"+
              " from competencia, actor, director"+
              " where competencia.actor_id = actor.id and competencia.director_id = director.id and"+
              " competencia.id = "+idCompetencia;
      }
    }else if (existeElGenero(genero_id)){
      return "select competencia.nombre, actor.nombre as actor_nombre, genero.nombre as genero_nombre"+
            " from competencia, actor, genero"+
            " where competencia.actor_id = actor.id and "+
            " competencia.genero_id = genero.id and competencia.id = "+idCompetencia;
    }else {
      return "select competencia.nombre, actor.nombre as actor_nombre"+
            " from competencia, actor"+
            " where competencia.actor_id = actor.id and"+
            " competencia.id = "+idCompetencia;
    }
  }else if (existeElDirector(director_id)) {
    if (existeElGenero(genero_id)) {
      return "select competencia.nombre, director.nombre as director_nombre, genero.nombre as genero_nombre"+
            " from competencia, director, genero"+
            " where competencia.director_id = director.id and"+
            " competencia.genero_id = genero.id and competencia.id = "+idCompetencia;
    }else {
      return "select competencia.nombre, director.nombre as director_nombre"+
            " from competencia, director"+
            " where competencia.director_id = director.id and"+
            " competencia.id = "+idCompetencia;
    }
}else if (existeElGenero(genero_id)) {
    return "select competencia.nombre, genero.nombre as genero_nombre"+
          " from competencia, genero"+
          " where competencia.genero_id = genero.id and competencia.id = "+idCompetencia;
  }else {
    return "select competencia.nombre"+
          " from competencia"+
          " where competencia.id = "+idCompetencia;
  }
}

function cargarCompetencia(req, res){
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
  var actor = resultado.actor_id;
  var director = resultado.director_id;
  var genero = resultado.genero_id;
  var nombreCompetencia = resultado.nombre;
  var competencia_id = resultado.id;
  var sql = crearSqlObtenerPeliculas(actor, director, genero);
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    var response = {
      'peliculas': resultado,
      'competencia': nombreCompetencia
    }
    guardarPeliculaOfrecida(response, competencia_id);
    res.send(JSON.stringify(response));
  });
}

function crearSqlObtenerPeliculas(actor, director, genero){
  var sql = " SELECT pelicula.id, pelicula.poster, pelicula.titulo ";
  var seleccionAleatoria = " ORDER BY rand() LIMIT 2"
  if (existeElActor(actor)) {
    if (existeElDirector(director)) {
      if (existeElGenero(genero)) {
        return sql + ", actor.nombre, director.nombre, genero.nombre"+
              " FROM pelicula, actor, director, genero, actor_pelicula, director_pelicula"+
              " WHERE actor_pelicula.actor_id =actor.id and actor_pelicula.pelicula_id = pelicula.id and"+
              " pelicula.genero_id = genero.id  and director_pelicula.director_id = director.id and director_pelicula.pelicula_id= pelicula.id and"+
              " actor.id ="+actor+" and director.id = "+director+" and genero.id = "+genero + seleccionAleatoria;
      }else {
        return sql + ", actor.nombre, director.nombre"+
              " FROM pelicula, actor, director, actor_pelicula, director_pelicula"+
              " WHERE actor_pelicula.actor_id =actor.id and actor_pelicula.pelicula_id = pelicula.id and"+
              " director_pelicula.director_id = director.id and director_pelicula.pelicula_id= pelicula.id and"+
              " actor.id ="+actor+" and director.id = "+director + seleccionAleatoria;
      }
    }else if (existeElGenero(genero)) {
      return sql + ", actor.nombre, genero.nombre"+
            " FROM pelicula, actor, genero, actor_pelicula"+
            " WHERE actor_pelicula.actor_id =actor.id and actor_pelicula.pelicula_id = pelicula.id and"+
            " pelicula.genero_id = genero.id"+
            " actor.id ="+actor+" and genero.id = "+genero + seleccionAleatoria;
    }else {
      return sql + ", actor.nombre"+
            " FROM pelicula, actor, actor_pelicula"+
            " WHERE actor_pelicula.actor_id =actor.id and actor_pelicula.pelicula_id = pelicula.id and"+
            " actor.id ="+actor + seleccionAleatoria;
    }
  }else if (existeElDirector(director)) {
    if (existeElGenero(genero)) {
      return sql + ", director.nombre, genero.nombre"+
            " FROM pelicula, director, genero, director_pelicula"+
            " WHERE pelicula.genero_id = genero.id  and director_pelicula.director_id = director.id and director_pelicula.pelicula_id= pelicula.id and"+
            " director.id = "+director+" and genero.id = "+genero + seleccionAleatoria;
    }else {
      return sql + ", director.nombre"+
            " FROM pelicula, director, director_pelicula"+
            " WHERE director_pelicula.director_id = director.id and director_pelicula.pelicula_id= pelicula.id and "+
            " director.id = "+director + seleccionAleatoria;
    }
  }else if (existeElGenero(genero)) {
    return sql + ", genero.nombre"+
          " FROM pelicula, genero"+
          " WHERE pelicula.genero_id = genero.id and"+
          " genero.id = "+genero + seleccionAleatoria;
  }else {
    return sql + "FROM pelicula" + seleccionAleatoria;
  }
}

function crearCompetencia(req, res){
  var datosRecibidos = req.body;
  var nombreCompetencia = datosRecibidos.nombre;
  var actor = datosRecibidos.actor;
  var director = datosRecibidos.director;
  var genero = datosRecibidos.genero;
  //cambiamos el valor de cero a null para poder utilizar los validadores
  if (actor == 0) {
    actor = null;
  }
  if (director == 0) {
    director = null;
  }
  if (genero == 0) {
    genero = null;
  }
  var sql = crearSqlCrearCompetencia(nombreCompetencia, actor, director, genero);
  manipularDatosEnBD(sql, res);
}

function crearSqlCrearCompetencia(nombreCompetencia, actor, director, genero){
  if (existeElActor(actor)) {
    if (existeElDirector(director)) {
      if (existeElGenero(genero)) {
        return "INSERT INTO competencia (nombre, genero_id, actor_id, director_id) VALUES ("+"'"+nombreCompetencia+"',"+genero+","+actor+","+director+")";
      }else {
        return "INSERT INTO competencia (nombre, actor_id, director_id) VALUES ("+"'"+nombreCompetencia+"',"+actor+","+director+")";
      }
    }else if (existeElGenero(genero)){
      return "INSERT INTO competencia (nombre, genero_id, actor_id) VALUES ("+"'"+nombreCompetencia+"',"+genero+","+actor+")";
    }else {
      return "INSERT INTO competencia (nombre, actor_id) VALUES ("+"'"+nombreCompetencia+"',"+actor+")";
    }
  }else if (existeElDirector(director)) {
    if (existeElGenero(genero)) {
      return "INSERT INTO competencia (nombre, genero_id, director_id) VALUES ("+"'"+nombreCompetencia+"',"+genero+","+director+")";
    }else {
      return "INSERT INTO competencia (nombre, director_id) VALUES ("+"'"+nombreCompetencia+"',"+director+")";
    }
  }else if (existeElGenero(genero)) {
    return "INSERT INTO competencia (nombre, genero_id) VALUES ("+"'"+nombreCompetencia+"',"+genero+")";
  }else {
    return "INSERT INTO competencia (nombre) VALUES ("+"'"+nombreCompetencia+"')";
  }
}

function eliminarCompetencia(req, res){
  var idCompetencia = req.params.idCompetencia;
  var sql = "UPDATE competencia SET estado = 0 WHERE competencia.id = "+idCompetencia;
  manipularDatosEnBD(sql, res);
}

function editarCompetencia(req, res){
  var idCompetencia = req.params.idCompetencia;
  var nuevoNombre = req.body.nombre;
  var sql = "UPDATE competencia SET nombre = '"+nuevoNombre+"' WHERE competencia.id = "+idCompetencia;
  manipularDatosEnBD(sql, res);
}

function sumarVotoDePelicula(req, res){
  var idCompetencia = req.params.idCompetencia;
  var idPelicula = req.body.idPelicula;
  var sql = "INSERT INTO voto (competencia_id, pelicula_id) VALUES ("+idCompetencia+", "+idPelicula+")";
  manipularDatosEnBD(sql, res);
}



function reiniciarVotacion(req, res){
  var idCompetencia = req.params.idCompetencia;
  var sql = "DELETE voto FROM voto INNER JOIN competencia ON voto.competencia_id = competencia.id WHERE competencia.id = "+idCompetencia ;
  manipularDatosEnBD(sql, res);
  var sql = "DELETE pelicula_ofrecida FROM pelicula_ofrecida WHERE competencia_id = "+idCompetencia ;
  manipularDatosEnBD(sql, res);
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
    cargarCompetencia: cargarCompetencia,
    sumarVotoDePelicula: sumarVotoDePelicula,
    devolverResultadoVotacion: devolverResultadoVotacion,
    cargarGeneros: cargarGeneros,
    cargarActores: cargarActores,
    cargarDirectores: cargarDirectores,
    crearCompetencia: crearCompetencia,
    reiniciarVotacion: reiniciarVotacion,
    buscarCompetencia: buscarCompetencia,
    eliminarCompetencia: eliminarCompetencia,
    editarCompetencia: editarCompetencia
  }

  function manipularDatosEnBD(sql, res){
    conexion.query(sql, function(error, resultado, fields){
      if(error){
        console.log("Hubo un error en la manipulacion de datos", error.message);
        return res.status(505).send("Hubo un error en la manipulacion de datos");
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

function guardarPeliculaOfrecida(datosPelicula, competencia_id){
  var idPelicula1 = datosPelicula.peliculas[0].id;
  var idPelicula2 = datosPelicula.peliculas[1].id;
  var sql = "INSERT INTO pelicula_ofrecida (competencia_id, pelicula_id) VALUES ("+competencia_id+", "+idPelicula1+")";
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("aca Hubo un error en la insercion de datos", error.message);
    }
  });
  sql = "INSERT INTO pelicula_ofrecida (competencia_id, pelicula_id) VALUES ("+competencia_id+", "+idPelicula2+")";
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("aca Hubo un error en la insercion de datos", error.message);
    }
  });
}

// function devolverResultadoVotacion(req, res){
//   var idCompetencia = req.params.id;
//   var sql = "select competencia.nombre, pelicula.id, pelicula.titulo, pelicula.poster,"+
//           " count(voto.pelicula_id) as votos from voto, pelicula, competencia where pelicula.id = voto.pelicula_id"+
//           " and competencia.id = voto.competencia_id and competencia.id = "+idCompetencia+
//           " group by voto.pelicula_id  order by votos desc limit 3";
//   conexion.query(sql, function(error, resultado, fields){
//     if(error){
//       console.log("Hubo un error en la consulta", error.message);
//       return res.status(404).send("Hubo un error en la consulta");
//     }
//     for (var i = 0; i < resultado.length; i++) {
//       calcularVotos(idCompetencia, resultado[i], res);
//       console.log("primero");
//     }
//   });
// }
//
// function calcularVotos(idCompetencia, datosVotacion, res){
//   var idPelicula = datosVotacion.id;
//   var votos = datosVotacion.votos;
//   var nombreCompetencia = datosVotacion.nombre;
//   var sql = "SELECT COUNT(pelicula_id) AS apariciones FROM  pelicula_ofrecida, competencia WHERE pelicula_ofrecida.competencia_id = competencia.id AND pelicula_id = "+idPelicula+" AND competencia.id = "+idCompetencia;
//   conexion.query(sql, function(error, resultado, fields){
//     if(error){
//       console.log("Hubo un error en la consulta", error.message);
//       return res.status(404).send("Hubo un error en la consulta");
//     }
//     //consulta de las apariciones de la pelicula en la competencia
//     var apariciones = resultado[0].apariciones;
//     //se divide la cantidad de votos de la pelicula por las apariciones que tuvo y se redondea el resultado
//     var votosReales = Math.round((votos/resultado[0].apariciones)*10);
//
//     var response = {
//       'resultados': datosVotacion,
//       'competencia': nombreCompetencia
//     }
//     console.log("segundo");
//     res.send(JSON.stringify(response));
//   });
// }

function devolverResultadoVotacion(req, res){
var idCompetencia = req.params.id;
var sql= "select competencia.nombre, pelicula.id, pelicula.titulo, pelicula.poster,"+
        " count(voto.pelicula_id) as votos from voto, pelicula, competencia where pelicula.id = voto.pelicula_id"+
        " and competencia.id = voto.competencia_id and competencia.id = "+idCompetencia+
        " group by voto.pelicula_id  order by votos desc limit 3";
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

function existeElActor(actor){
  return (actor != null);
}

function existeElDirector(director){
  return (director != null);
}

function existeElGenero(genero){
  return (genero != null);
}
