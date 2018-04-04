# Elige la imagen de Ubuntu
FROM ubuntu:trusty

# Autor
MAINTAINER Alexis Romero

# Instalar Node.js y algunas dependencias
RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup_6.x | sudo bash - && \
    apt-get -y install python build-essential nodejs

# Pasa módulos de Node (node_modules) para caché
ADD package.json /src/package.json

# Elige el directorio de trabajo que va a existir dento del contenedor donde trabajemos
WORKDIR /src
#Expone el puerto 8080
EXPOSE 8080

# Instala dependencias
RUN npm install

# Copia del directorio donde está el código al directorio dentro
# del container donde se va a ejecutar
COPY [".", "/src"]

# Ejecuta la aplicación con el parámetro
CMD ["node", "/src/server.js"]
