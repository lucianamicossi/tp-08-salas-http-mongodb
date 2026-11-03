const Reserva = require("../modelos/reserva");

function crearServicioReservas() {
  async function listar(criterio = {}) {
    return Reserva.find(criterio).exec();
  }

  async function buscarPorId(id) {
    return Reserva.findById(id).exec();
  }

  async function contar() {
    return Reserva.countDocuments().exec();
  }

  async function crear(datos) {
    return Reserva.create(datos);
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
  };
}

module.exports = {
  crearServicioReservas,
};
