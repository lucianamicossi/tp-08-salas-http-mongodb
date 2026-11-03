# Trabajo práctico 08 – Salas con HTTP y MongoDB

## 1. Punto de partida y objetivo

Este proyecto parte del Trabajo práctico 07 – Salas con MongoDB.

El objetivo de esta unidad es integrar la persistencia con MongoDB Atlas en la aplicación web desarrollada con Express, manteniendo las vistas HTML y agregando una API REST que permita consultar y crear reservas mediante respuestas JSON.

A diferencia del TP07, en este trabajo las operaciones del sitio web y de la API utilizan la misma base de datos MongoDB. Por lo tanto, una reserva creada desde el formulario HTML también puede consultarse desde la API, y viceversa.

La aplicación utiliza Node.js, Express, Mongoose y MongoDB Atlas.

## 2. Versiones y tecnologías utilizadas

Versiones del entorno de desarrollo:

- **Node.js:** v24.11.1
- **npm:** 11.6.2
- **Express:** 5.2.1
- **Mongoose:** 9.11.2
- **EJS:** 6.0.1
- **Morgan:** 1.12.1
- **Prettier:** 3.9.9
- **ESLint:** 10.11.0

Base de datos: MongoDB Atlas, clúster gratuito M0.

El proyecto utiliza CommonJS (`require` y `module.exports`) y variables de entorno para mantener las credenciales fuera del código fuente.

## 3. Preparación del proyecto desde una descarga nueva

### 3.1. Instalar dependencias

Clonar o descargar el repositorio y abrir una terminal en la carpeta raíz del proyecto.

Ejecutar: npm install

### 3.2. Configurar MongoDB Atlas

1. Crear una cuenta en MongoDB Atlas o ingresar a una cuenta existente.
2. Disponer de un clúster gratuito M0.
3. Crear un usuario de base de datos con su contraseña.
4. Configurar el acceso de red desde Network Access.
5. Obtener la URI de conexión correspondiente al clúster.

La base de datos utilizada por este proyecto es `reservas_salas_u8` y la colección es `reservas`.

La configuración de acceso de red debe realizarse con criterios de seguridad. Para un entorno de producción se recomienda autorizar solamente las direcciones IP necesarias, utilizar una contraseña segura y asignar permisos mínimos al usuario de base de datos.

### 3.3. Configurar las variables de entorno

El proyecto incluye una plantilla `.env.example`.

Crear el archivo local `.env` a partir de ella: Copy-Item .env.example .env

Completar el archivo `.env` con los datos reales del entorno local.

Ejemplo de configuración:

env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@cluster0.hprxnnu.mongodb.net/reservas_salas_u8?retryWrites=true&w=majority

Reemplazar `USUARIO` y `CONTRASENA` por las credenciales reales únicamente en `.env`.

La plantilla `.env.example` debe conservar los valores de ejemplo, sin credenciales reales.

No publicar `.env`, contraseñas ni la URI completa de conexión.

### 3.4. Comprobar la conexión con MongoDB

Desde la carpeta raíz del proyecto: npm run comprobardb

También se puede ejecutar directamente: node --env-file=.env scripts/comprobar-conexion.js

Si la conexión es correcta, se muestra un mensaje de confirmación.

### 3.5. Ejecutar los controles de calidad

Aplicar el formato: npm run format

Comprobar el formato y ejecutar ESLint: npm run check

Los controles incluyen los archivos JavaScript de las carpetas `src` y `scripts`.

### 3.6. Iniciar la aplicación

npm start

Por defecto, el servidor se inicia en: `http://localhost:3000`

El puerto puede modificarse mediante la variable `PORT`.

## 4. Estructura del proyecto

La estructura principal es:

tp-08-salas-http-mongodb/
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
├── README.md
│
├── scripts/
│   ├── comprobar-conexion.js
│   ├── crear-reserva.js
│   └── listar-reservas.js
│
├── src/
│   ├── index.js
│   ├── app.js
│   │
│   ├── config/
│   │   ├── entorno.js
│   │   └── base-datos.js
│   │
│   ├── modelos/
│   │   └── reserva.js
│   │
│   ├── servicios/
│   │   └── reservas.js
│   │
│   ├── controladores/
│   │   ├── reservas.js
│   │   └── api-reservas.js
│   │
│   ├── rutas/
│   │   ├── reservas.js
│   │   └── api-reservas.js
│   │
│   └── middleware/
│       ├── solicitudes.js
│       ├── reservas.js
│       └── api-reservas.js
│
├── public/
│   └── css/
│       └── estilos.css
│
└── views/
    ├── layouts/
    │   └── main.ejs
    ├── reservas/
    │   ├── detalle.ejs
    │   ├── lista.ejs
    │   └── nueva.ejs
    ├── inicio.ejs
    └── no-encontrado.ejs

### Responsabilidades principales

- `src/config/entorno.js`: lee y valida las variables de entorno.
- `src/config/base-datos.js`: establece y finaliza la conexión con MongoDB mediante Mongoose.
- `src/modelos/reserva.js`: define el esquema y el modelo de reserva.
- `src/servicios/reservas.js`: contiene las operaciones de consulta, creación y conteo de reservas.
- `src/controladores/reservas.js`: gestiona las solicitudes de las vistas HTML.
- `src/controladores/api-reservas.js`: gestiona las solicitudes y respuestas JSON de la API.
- `src/rutas/reservas.js`: define las rutas de la aplicación web.
- `src/rutas/api-reservas.js`: define los endpoints de la API.
- `src/middleware/reservas.js`: valida los datos recibidos desde el formulario HTML.
- `src/middleware/api-reservas.js`: valida los datos recibidos por la API.
- `src/middleware/solicitudes.js`: gestiona información de las solicitudes HTTP.
- `src/app.js`: configura Express, los middlewares, las vistas y las rutas.
- `src/index.js`: conecta con MongoDB e inicia el servidor.
- `scripts/`: contiene programas independientes para comprobar la conexión y realizar operaciones de consola.

## 5. Modelo de datos y validaciones

El modelo `Reserva` utiliza Mongoose y almacena documentos en la colección `reservas`.

Los campos son:

| Campo       | Tipo    | Reglas                                                              |
|-------------|---------|---------------------------------------------------------------------|
| `estudiante`| String  | Obligatorio; elimina espacios exteriores mediante `trim`.           |
| `email`     | String  | Obligatorio; elimina espacios exteriores y debe contener `@`.       |
| `sala`      | String  | Obligatoria; Sala Norte, Sala Sur o Sala Multimedia.                |
| `fecha`     | String  | Obligatoria; elimina espacios exteriores.                           |
| `turno`     | String  | Obligatorio; Mañana, Tarde o Noche.                                 |
| `personas`  | Number  | Obligatorio; número entero entre 1 y 6 inclusive.                   |
| `estado`    | String  | Valores permitidos: pendiente o confirmada. Por defecto: pendiente. |
| `_id`       | ObjectId| Identificador generado por MongoDB/Mongoose.                        |

El campo `estado` se establece automáticamente con el valor `pendiente` al crear una reserva. No se permite que el cliente lo establezca libremente durante la creación.

La validación del email es mínima: comprobar que contenga `@` no garantiza que la dirección exista ni que tenga un formato completo válido.

La fecha se almacena como texto. El esquema no comprueba que sea una fecha real, que corresponda a un día futuro o que tenga disponibilidad asociada.

Tampoco se comprueba la superposición de horarios entre reservas. Esa funcionalidad queda fuera del alcance de esta implementación.

## 6. Funcionamiento de la aplicación web y de la API

La aplicación utiliza un servicio compartido de reservas que consulta y modifica MongoDB.

Tanto el formulario HTML como la API trabajan con la misma colección. Las operaciones de lectura y escritura se realizan de forma asíncrona.

### 6.1. Rutas de la aplicación web

| Método | Ruta             | Función                                                 |
|--------|------------------|---------------------------------------------------------|
| GET    | `/`              | Muestra la página principal.                            |
| GET    | `/estado`        | Informa el estado del servicio y la cantidad de reservas almacenadas. |
| GET    | `/reservas`      | Muestra el listado de reservas.                         |
| GET    | `/reservas/nueva`| Muestra el formulario de creación.                      |
| POST   | `/reservas`      | Valida y crea una reserva en MongoDB.                   |
| GET    | `/reservas/:id`  | Muestra el detalle de una reserva.                      |

El formulario conserva los datos ingresados cuando hay errores de validación y responde con HTTP 400. Cuando la creación es correcta, redirige al listado.

### 6.2. Endpoints de la API REST

La API utiliza el prefijo `/api/reservas` y trabaja con formato JSON.

| Método | Endpoint           | Resultado esperado                        |
|--------|--------------------|-------------------------------------------|
| GET    | `/api/reservas`    | Devuelve todas las reservas.              |
| GET    | `/api/reservas/:id`| Devuelve una reserva por su identificador.|
| POST   | `/api/reservas`    | Valida y crea una reserva.                |

Para crear una reserva se envía un objeto JSON con los siguientes campos:

{
  "estudiante": "Juan Perez",
  "email": "juan.prueba@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-11-05",
  "turno": "Mañana",
  "personas": 2
}

El cliente debe enviar el encabezado:

`Content-Type: application/json`

La respuesta de creación es HTTP 201 Created e incluye el recurso creado y el encabezado `Location` con la dirección del nuevo recurso.

El identificador se representa mediante el campo `id` como texto.

### 6.3. Filtro por sala

La API permite filtrar las reservas por coincidencia exacta de sala.

Ejemplo: GET /api/reservas?sala=Sala%20Norte

Si no existen reservas para la sala solicitada, devuelve un arreglo vacío.

No se admiten valores repetidos del parámetro `sala`.

### 6.4. Respuestas y manejo de errores

La API utiliza los siguientes códigos HTTP:

- **200 OK:** consulta realizada correctamente.
- **201 Created:** reserva creada correctamente.
- **400 Bad Request:** datos inválidos, JSON mal formado o identificador incorrecto.
- **404 Not Found:** recurso o ruta inexistente.
- **500 Internal Server Error:** error inesperado del servidor.

Las respuestas de error de la API se envían en formato JSON.

El middleware de errores evita exponer trazas internas, credenciales o información sensible.

Las rutas inexistentes bajo `/api` responden en JSON. Las rutas web inexistentes muestran la página HTML correspondiente.

No se implementan operaciones PUT, PATCH ni DELETE en esta versión.

## 7. Persistencia y conexión con MongoDB

La conexión se establece al iniciar el servidor. Express comienza a escuchar solicitudes después de que la conexión con MongoDB se establece correctamente.

Las operaciones de consulta y creación se realizan mediante Mongoose y son asíncronas.

La aplicación no utiliza un arreglo en memoria como almacenamiento principal ni inserta reservas automáticamente al arrancar.

El servicio permite:

- Crear reservas.
- Listar reservas.
- Buscar una reserva por identificador.
- Contar los documentos almacenados.

El servidor mantiene la conexión mientras está funcionando y contempla su cierre ordenado al recibir señales de finalización.

Los scripts de consola son independientes del servidor y finalizan su conexión una vez completada cada operación.

### Diagnóstico de DNS y conectividad

Durante el desarrollo se realizaron comprobaciones de resolución DNS y conectividad con Atlas.

Comandos utilizados en Windows PowerShell: nslookup -type=SRV _mongodb._tcp.cluster0.hprxnnu.mongodb.net

Resolve-DnsName -Type SRV _mongodb._tcp.cluster0.hprxnnu.mongodb.net

También se comprobó la conectividad TCP al puerto 27017 mediante `Test-NetConnection` utilizando un host del clúster obtenido de los registros SRV.

Durante el diagnóstico se configuraron resolutores DNS públicos en el proceso de Node.js mediante:

dns.setServers(["8.8.8.8", "1.1.1.1"]);

La conexión se verificó posteriormente con el script `comprobar-conexion.js`.

Si se presentan problemas de conexión, revisar la URI, las credenciales, la lista de acceso de Atlas y la resolución DNS.

## 8. Pruebas realizadas y resultados

Las pruebas se realizaron con la aplicación web, la API y scripts de consola.

### 8.1. Controles de calidad

| Prueba               | Resultado                                            |
|----------------------|------------------------------------------------------|
| `npm run format`     | Correcto; Prettier procesó `src` y `scripts`.        |
| `npm run check`      | Correcto; formato y ESLint finalizaron sin errores.  |
| `npm run comprobardb`| Conexión con MongoDB Atlas establecida correctamente.|

### 8.2. Persistencia mediante scripts

Se ejecutó el script de listado cuando la colección estaba vacía.

Luego se ejecutó el script de creación, que insertó una reserva de prueba y devolvió su identificador.

Finalmente, se ejecutó nuevamente el script de listado en otro proceso de consola. La reserva apareció con el mismo identificador.

Datos de la reserva de prueba:

- Estudiante: `Juan Perez`.
- Email: `juan.prueba@example.com`.
- Sala: `Sala Norte`.
- Fecha: `2026-10-25`.
- Turno: `Mañana`.
- Personas: `2`.
- Identificador observado: `6ae9342de3170b0301f6daf0`.

Esta prueba permitió comprobar que los datos permanecen almacenados en MongoDB aunque finalice el proceso que los creó.

### 8.3. Pruebas de la API con Postman

| Prueba                                   | Resultado                                          |
|------------------------------------------|----------------------------------------------------|
| GET `/api/reservas`                      | HTTP 200; devuelve las reservas almacenadas.       |
| GET `/api/reservas/:id`                  | HTTP 200; devuelve la reserva solicitada.          |
| POST `/api/reservas` válido              | HTTP 201; crea una reserva.                        |
| POST con email inválido                  | HTTP 400.                                          |
| POST con 8 personas                      | HTTP 400.                                          |
| GET con filtro de sala existente         | HTTP 200; devuelve los resultados correspondientes.|
| GET con filtro sin resultados            | HTTP 200; devuelve `[]`.                           |
| GET con identificador mal formado        | HTTP 400.                                          |
| GET con identificador válido inexistente | HTTP 404.                                          |
| POST con JSON mal formado                | HTTP 400.                                          |
| GET a una ruta API inexistente           | HTTP 404 en formato JSON.                          |

Se comprobó también la creación de una reserva desde Postman:

- Estudiante: `Maria Gomez`.
- Email: `maria.prueba@example.com`.
- Sala: `Sala Sur`.
- Fecha: `2026-11-05`.
- Turno: `Tarde`.
- Personas: `3`.
- Identificador observado: `6ae9365cf55a7c8870f42e7c`.

### 8.4. Pruebas de la aplicación web

Se verificaron las siguientes operaciones:

- Acceso a la página principal.
- Acceso a `/estado`, con conteo de reservas desde MongoDB.
- Visualización del listado.
- Visualización del formulario.
- Creación correcta de una reserva desde el formulario.
- Respuesta HTTP 400 ante datos inválidos.
- Conservación de los datos ingresados ante errores de validación.
- Acceso al archivo CSS.
- Respuesta de página 404 ante rutas web inexistentes.

También se comprobó la creación de una reserva desde el formulario HTML:

- Estudiante: `Carlos Ruiz`.
- Email: `carlos.prueba@example.com`.
- Sala: `Sala Multimedia`.
- Fecha: `2026-11-10`.
- Turno: `Noche`.
- Personas: `4`.

Las reservas creadas desde el formulario y desde Postman se almacenaron en la misma colección de MongoDB.

## 9. Seguridad y archivos que no deben publicarse

El proyecto utiliza `.gitignore` para excluir archivos locales y sensibles.

Se excluyen: 
node_modules/
.env

El archivo `.env.example` se mantiene como plantilla para que otra persona pueda configurar su propio entorno.

Antes de publicar el repositorio, comprobar que no se incluyan:

- El archivo `.env`.
- Contraseñas.
- URI de conexión con credenciales.
- Tokens u otros secretos.
- Archivos personales o locales que no formen parte del proyecto.

La información de conexión debe mantenerse fuera del repositorio, especialmente si es público.

## 10. Conclusión

En este trabajo se integró MongoDB Atlas con una aplicación Express mediante Mongoose.

Se incorporó persistencia real para las reservas y se mantuvieron las vistas HTML, agregando una API REST que utiliza los mismos datos.

Se implementaron validaciones, respuestas HTTP apropiadas, manejo centralizado de errores, consultas por identificador y filtros por sala.

Las pruebas realizadas permitieron comprobar la conexión con Atlas, la persistencia entre procesos de consola y la creación y consulta de documentos desde la aplicación web y desde Postman.





