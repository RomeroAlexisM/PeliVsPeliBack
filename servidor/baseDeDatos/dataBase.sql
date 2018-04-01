-- CREATE TABLE `competencia` (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `nombre` varchar(70) NOT NULL DEFAULT '',
--   PRIMARY KEY (`id`)
-- )
--
-- INSERT INTO `competencia` VALUES (1, "Peor pelicula del año"), (2, "Mejor pelicula comica"), (3,"Pelicula màs terrorifica");

CREATE TABLE `voto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `competencia_id` int(11) NOT NULL,
  `pelicula_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`competencia_id`) REFERENCES `competencia` (`id`),
  FOREIGN KEY (`pelicula_id`) REFERENCES `pelicula` (`id`)
);

CREATE TABLE `pelicula_ofrecida` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `competencia_id` int(11) NOT NULL,
  `pelicula1_id` int(11) unsigned NOT NULL,
  `pelicula2_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`competencia_id`) REFERENCES `competencia` (`id`),
  FOREIGN KEY (`pelicula1_id`) REFERENCES `pelicula` (`id`),
  FOREIGN KEY (`pelicula2_id`) REFERENCES `pelicula` (`id`)
);


 select  competencia.nombre, pelicula.titulo, count(voto.pelicula_id) as votos from voto, competencia, pelicula where pelicula_id = pelicula_id and pelicula_id = pelicula.id and competencia_id = competencia.id and competencia.id = 1;
