# API de Juegos

Esta API proporciona acceso a una colección de juegos.

## Uso

Puedes acceder a la API en el siguiente endpoint:

- Base URL: https://api-games-jk31.onrender.com

### Endpoints de la API

La API expone los siguientes endpoints:

- `GET /products`: Obtiene todos los juegos disponibles.
- `GET /products/:id`: Obtiene información detallada de un juego por su ID.
- `POST /products`: Agrega un nuevo juego a la colección.
- `PUT /products/:id`: Actualiza la información de un juego existente.
- `DELETE /products/:id`: Elimina un juego de la colección.

Para utilizar estos endpoints, simplemente realiza las solicitudes HTTP correspondientes a la URL base junto con la ruta del endpoint deseado.

- Para obtener todos los juegos: 

`GET https://api-games-jk31.onrender.com/products`

- Para obtener información detallada de un juego con ID 010: 

`GET https://api-games-jk31.onrender.com/products/010`

- Para agregar un nuevo juego: 

`POST https://api-games-jk31.onrender.com/products`

- Para actualizar un juego existente con ID 010: 

`PUT https://api-games-jk31.onrender.com/products/010`

- Para eliminar un juego con ID 010: 

`DELETE https://api-games-jk31.onrender.com/products/010`


La realizacion de esta API es 100% con fines de practica.
