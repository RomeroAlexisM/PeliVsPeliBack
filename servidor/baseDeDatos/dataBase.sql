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
