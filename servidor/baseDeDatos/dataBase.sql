CREATE TABLE `competencia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(70) NOT NULL DEFAULT '',
  `estado` int(11) NOT NULL DEFAULT 1,
  `actor_id` int(11) unsigned,
  `director_id` int(11) unsigned,
  `genero_id` int(11) unsigned,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`),
  FOREIGN KEY (`director_id`) REFERENCES `director` (`id`),
  FOREIGN KEY (`genero_id`) REFERENCES `genero` (`id`)
);

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
