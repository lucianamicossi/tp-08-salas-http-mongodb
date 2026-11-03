const express = require("express");
const { validarReservaApi } = require("../middleware/api-reservas");

function crearRouterApiReservas(controlador) {
  const router = express.Router();

  router.get("/", controlador.listar);
  router.get("/:id", controlador.detalle);
  router.post("/", validarReservaApi, controlador.crear);

  return router;
}

module.exports = { crearRouterApiReservas };
