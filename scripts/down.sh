#!/bin/bash

echo "🔌 Apagando infraestructura soberana..."

# Detiene los contenedores sin borrar los volúmenes (los datos quedan a salvo)
docker compose down

echo "💤 Búnker fuera de línea. Los datos persisten en los volúmenes locales."