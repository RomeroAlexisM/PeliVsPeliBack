FROM mysql:5.7.15

MAINTAINER Alexis Romero

ENV MYSQL_DATABASE=competencias \
    MYSQL_ROOT_PASSWORD=123456

ADD dump_base_de_datos.sql /docker-etrypoint-initdb.d

EXPOSE 3306
