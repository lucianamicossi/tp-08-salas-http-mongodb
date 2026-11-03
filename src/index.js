const { leerConfiguracion } = require("./config/entorno");
const { conectarBaseDatos, desconectarBaseDatos, } = require("./config/base-datos");

const { crearApp } = require("./app");

const { crearServicioReservas } = require("./servicios/reservas");

const { crearControladorReservas } = require("./controladores/reservas");
const { crearControladorApiReservas } = require("./controladores/api-reservas");

const { crearRouterReservas } = require("./rutas/reservas");
const { crearRouterApiReservas } = require("./rutas/api-reservas");

const { salasPermitidas, turnosPermitidos } = require("./middleware/reservas");

async function iniciarServidor() {
  const config = leerConfiguracion();

  // Conexión con MongoDB.
  await conectarBaseDatos();

  console.log("Conexión con MongoDB establecida correctamente.");

  // Servicio que trabaja con MongoDB.
  const servicio = crearServicioReservas();

  // Controlador y rutas HTML.
  const controlador = crearControladorReservas(servicio, {
    salasPermitidas,
    turnosPermitidos,
  });

  const routerReservas = crearRouterReservas(controlador);

  // Controlador y rutas de la API.
  const controladorApi = crearControladorApiReservas(servicio);

  const routerApiReservas = crearRouterApiReservas(controladorApi);

  // Alicación Express.
  const app = crearApp({
    controlador,
    routerReservas,
    routerApiReservas,
    config,
  });

  // El servidor comienza a escuchar después de conectar MongoDB.
  const servidor = app.listen(config.puerto, () => {
    console.log(`Servidor iniciado en http://localhost:${config.puerto}`);
  });

  let cerrando = false;

  async function cerrarServidor(signal) {
    if (cerrando) {
      return;
    }

    cerrando = true;

    console.log(`\nSeñal ${signal} recibida. Cerrando servidor...`);

    servidor.close(async (error) => {
      try {
        await desconectarBaseDatos();

        console.log("Conexión con MongoDB cerrada.");

        if (error) {
          console.error("Ocurrió un error al cerrar el servidor.");
          process.exitCode = 1;
        }
      } catch {
        console.error("No se pudo cerrar correctamente la conexión.");
        process.exitCode = 1;
      }
    });
  }

  process.once("SIGINT", () => cerrarServidor("SIGINT"));
  process.once("SIGTERM", () => cerrarServidor("SIGTERM"));
}

iniciarServidor().catch((error) => {
  console.error("No se pudo iniciar la aplicación.");
  console.error(`Tipo de error: ${error.name}`);
  process.exitCode = 1;
});
