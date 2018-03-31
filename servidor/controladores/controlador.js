var conexion = require('../baseDeDatos/conexionDB.js');

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

module.exports = {
    buscarTodasLasCompetencias: buscarTodasLasCompetencias
  }
