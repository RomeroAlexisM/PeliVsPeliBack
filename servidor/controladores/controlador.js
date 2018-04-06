var conexion = require('../baseDeDatos/conexionDB.js');

function buscarTodasLasCompetencias(req, res){
  var sql = "SELECT * FROM competencia WHERE estado = 1";
  buscarDatosEnBD(sql, res);
}

function buscarCompetencia(req, res){
  var idCompetencia = req.params.id;
  var sql = "SELECT * FROM competencia WHERE id="+idCompetencia;
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
        return "SELECT competencia.nombre, actor.nombre AS actor_nombre, director.nombre AS director_nombre, genero.nombre AS genero_nombre"+
              " FROM competencia, actor, director, genero"+
              " WHERE competencia.actor_id = actor.id AND competencia.director_id = director.id AND"+
              " competencia.genero_id = genero.id AND competencia.id = "+idCompetencia;
      }else {
        return "SELECT competencia.nombre, actor.nombre AS actor_nombre, director.nombre AS director_nombre"+
              " FROM competencia, actor, director"+
              " WHERE competencia.actor_id = actor.id AND competencia.director_id = director.id AND"+
              " competencia.id = "+idCompetencia;
      }
    }else if (existeElGenero(genero_id)){
      return "SELECT competencia.nombre, actor.nombre AS actor_nombre, genero.nombre AS genero_nombre"+
            " FROM competencia, actor, genero"+
            " WHERE competencia.actor_id = actor.id AND "+
            " competencia.genero_id = genero.id AND competencia.id = "+idCompetencia;
    }else {
      return "SELECT competencia.nombre, actor.nombre AS actor_nombre"+
            " FROM competencia, actor"+
            " WHERE competencia.actor_id = actor.id AND"+
            " competencia.id = "+idCompetencia;
    }
  }else if (existeElDirector(director_id)) {
    if (existeElGenero(genero_id)) {
      return "SELECT competencia.nombre, director.nombre AS director_nombre, genero.nombre AS genero_nombre"+
            " FROM competencia, director, genero"+
            " WHERE competencia.director_id = director.id AND"+
            " competencia.genero_id = genero.id AND competencia.id = "+idCompetencia;
    }else {
      return "SELECT competencia.nombre, director.nombre AS director_nombre"+
            " FROM competencia, director"+
            " WHERE competencia.director_id = director.id AND"+
            " competencia.id = "+idCompetencia;
    }
}else if (existeElGenero(genero_id)) {
    return "SELECT competencia.nombre, genero.nombre AS genero_nombre"+
          " FROM competencia, genero"+
          " WHERE competencia.genero_id = genero.id AND competencia.id = "+idCompetencia;
  }else {
    return "SELECT competencia.nombre"+
          " FROM competencia"+
          " WHERE competencia.id = "+idCompetencia;
  }
}

function cargarCompetencia(req, res){
  var idCompetencia = req.params.id;
  var sql = "SELECT * FROM competencia WHERE id="+idCompetencia;
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
    for (var i = 0; i < resultado.length; i++) {
        guardarPeliculaOfrecida(competencia_id, resultado[i].id);
    }
    var response = {
      'peliculas': resultado,
      'competencia': nombreCompetencia
    }
    res.send(JSON.stringify(response));
  });
}

function guardarPeliculaOfrecida(idCompetencia, idPelicula){
  var sql = "INSERT INTO pelicula_ofrecida (competencia_id, pelicula_id) VALUES ("+idCompetencia+","+idPelicula+")";
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la manipulacion de datos", error.message);
    }
  });
}

function crearSqlObtenerPeliculas(actor, director, genero){
  var sql = " SELECT pelicula.id, pelicula.poster, pelicula.titulo ";
  var seleccionAleatoria = " ORDER BY rAND() LIMIT 2"
  if (existeElActor(actor)) {
    if (existeElDirector(director)) {
      if (existeElGenero(genero)) {
        return sql + ", actor.nombre, director.nombre, genero.nombre"+
              " FROM pelicula, actor, director, genero, actor_pelicula, director_pelicula"+
              " WHERE actor_pelicula.actor_id =actor.id AND actor_pelicula.pelicula_id = pelicula.id AND"+
              " pelicula.genero_id = genero.id  AND director_pelicula.director_id = director.id AND director_pelicula.pelicula_id= pelicula.id AND"+
              " actor.id ="+actor+" AND director.id = "+director+" AND genero.id = "+genero + seleccionAleatoria;
      }else {
        return sql + ", actor.nombre, director.nombre"+
              " FROM pelicula, actor, director, actor_pelicula, director_pelicula"+
              " WHERE actor_pelicula.actor_id =actor.id AND actor_pelicula.pelicula_id = pelicula.id AND"+
              " director_pelicula.director_id = director.id AND director_pelicula.pelicula_id= pelicula.id AND"+
              " actor.id ="+actor+" AND director.id = "+director + seleccionAleatoria;
      }
    }else if (existeElGenero(genero)) {
      return sql + ", actor.nombre, genero.nombre"+
            " FROM pelicula, actor, genero, actor_pelicula"+
            " WHERE actor_pelicula.actor_id =actor.id AND actor_pelicula.pelicula_id = pelicula.id AND"+
            " pelicula.genero_id = genero.id"+
            " actor.id ="+actor+" AND genero.id = "+genero + seleccionAleatoria;
    }else {
      return sql + ", actor.nombre"+
            " FROM pelicula, actor, actor_pelicula"+
            " WHERE actor_pelicula.actor_id =actor.id AND actor_pelicula.pelicula_id = pelicula.id AND"+
            " actor.id ="+actor + seleccionAleatoria;
    }
  }else if (existeElDirector(director)) {
    if (existeElGenero(genero)) {
      return sql + ", director.nombre, genero.nombre"+
            " FROM pelicula, director, genero, director_pelicula"+
            " WHERE pelicula.genero_id = genero.id  AND director_pelicula.director_id = director.id AND director_pelicula.pelicula_id= pelicula.id AND"+
            " director.id = "+director+" AND genero.id = "+genero + seleccionAleatoria;
    }else {
      return sql + ", director.nombre"+
            " FROM pelicula, director, director_pelicula"+
            " WHERE director_pelicula.director_id = director.id AND director_pelicula.pelicula_id= pelicula.id AND "+
            " director.id = "+director + seleccionAleatoria;
    }
  }else if (existeElGenero(genero)) {
    return sql + ", genero.nombre"+
          " FROM pelicula, genero"+
          " WHERE pelicula.genero_id = genero.id AND"+
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

function devolverResultadoVotacion(req, res){
  var idCompetencia = req.params.id;
  var sql = "SELECT COUNT(voto.pelicula_id) AS votos, pelicula.id AS pelicula_id"+
            " FROM voto,pelicula WHERE voto.pelicula_id = pelicula.id"+
            " AND voto.competencia_id = "+idCompetencia+" GROUP BY voto.pelicula_id";
  conexion.query(sql, function(error, resultado, fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
      calcularVotos(idCompetencia, resultado, res);
  });
}

function calcularVotos(idCompetencia, datosPeliculas, res){
  var sql = "SELECT competencia.nombre, pelicula.titulo, pelicula.poster,"+
            " COUNT(pelicula_ofrecida.pelicula_id) AS apariciones, pelicula.id AS pelicula_id"+
            " FROM pelicula_ofrecida, pelicula, voto, competencia WHERE pelicula_ofrecida.pelicula_id = pelicula.id"+
            " AND pelicula_ofrecida.competencia_id = "+idCompetencia+" AND voto.pelicula_id = pelicula_ofrecida.pelicula_id "+
            " AND competencia.id = pelicula_ofrecida.competencia_id GROUP BY pelicula_ofrecida.pelicula_id";
  conexion.query(sql, function(error, resultado, fields){
    var resultados = [];
    var totalDePeliculas = 0;
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    for (var i = 0; i < resultado.length; i++) {
        if (resultado[i].pelicula_id == datosPeliculas[i].pelicula_id) {
        resultados[i] ={
          'votos':  Math.round((datosPeliculas[i].votos/resultado[i].apariciones)*10),//Se divide la cantidad de votos con respecto a las apariciones de la pelicula
          'pelicula_id': resultado[i].pelicula_id,
          'poster': resultado[i].poster,
          'titulo': resultado[i].titulo
        }
        totalDePeliculas ++;
        }
    }
    if (resultado.length == totalDePeliculas) {
      //ordena el objeto resutlados de mayor a menos
      resultados.sort(function (a, b){//fuente: https://comoprogramo.wordpress.com/2012/06/29/como-ordenar-en-javascript-un-array-de-objetos-por-cualquier-campo/
        return (b.votos - a.votos)
      })
      var response ={
        'competencia': resultado[0].nombre,
        'resultados': resultados,
      }
      res.send(JSON.stringify(response));
    }
  });
}

function reiniciarVotacion(req, res){
  var idCompetencia = req.params.idCompetencia;
  var sql = "DELETE voto FROM voto INNER JOIN competencia ON voto.competencia_id = competencia.id WHERE competencia.id = "+idCompetencia ;
  manipularDatosEnBD(sql, res);
  // var sql = "DELETE pelicula_ofrecida FROM pelicula_ofrecida INNER JOIN competencia ON pelicula_ofrecida.competencia_id = competencia.id WHERE competencia.id = "+idCompetencia ;
  // manipularDatosEnBD(sql, res);
}

function cargarGeneros(req, res){
  var sql = "SELECT * FROM genero";
  buscarDatosEnBD(sql, res);
}

function cargarActores(req, res){
  var sql = "SELECT * FROM actor";
  buscarDatosEnBD(sql, res);
}

function cargarDirectores(req, res){
  var sql = "SELECT * FROM director";
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



function existeElActor(actor){
  return (actor != null);
}

function existeElDirector(director){
  return (director != null);
}

function existeElGenero(genero){
  return (genero != null);
}
