const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

function crearApp({ controlador, routerReservas, routerApiReservas, config }) {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));

  app.use(expressLayouts);
  app.set("layout", "layouts/main");

  app.use(morgan(config.formatoRegistro));
  app.use(identificarSolicitud);
  app.use(medirDuracion);

  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", controlador.inicio);
  app.get("/estado", controlador.estado);

  // API REST: respuestas JSON.
  app.use("/api/reservas", routerApiReservas);

  // Rutas desconocidas dentro de la API.
  app.use("/api", (req, res) => {
    res.status(404).json({
      error: "La ruta de la API solicitada no existe.",
    });
  });

  // Sitio HTML.
  app.use("/reservas", routerReservas);

  // Rutas HTML desconocidas.
  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  // Middleware de errores.
  app.use((error, req, res, next) => {
    void next;

    const esApi =
      req.originalUrl === "/api" || req.originalUrl.startsWith("/api/");

    if (esApi) {
      if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        Object.hasOwn(error, "body")
      ) {
        return res.status(400).json({
          error: "El JSON enviado no tiene un formato válido.",
        });
      }

      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          error: "Los datos enviados no son válidos.",
        });
      }

      return res.status(500).json({
        error: "Ocurrió un error interno al procesar la solicitud.",
      });
    }

    console.error("Error interno al procesar la solicitud.");

    return res.status(500).render("no-encontrado", {
      titulo: "Error del servidor",
      mensaje: "Ocurrió un error interno. Intentá nuevamente más tarde.",
    });
  });

  return app;
}

module.exports = { crearApp };
