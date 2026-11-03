function crearControladorReservas(servicio, opciones) {
  const { salasPermitidas, turnosPermitidos } = opciones;

  function inicio(req, res) {
    res.render("inicio", { titulo: "Inicio" });
  }

  async function estado(req, res) {
    res.json({
      servicio: "activo",
      reservas: await servicio.contar(),
      solicitudId: res.locals.solicitudId,
    });
  }

  async function listar(req, res) {
    const reservas = await servicio.listar();

    res.render("reservas/lista", {
      titulo: "Reservas",
      reservas,
    });
  }

  function mostrarFormulario(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      datos: {
        estudiante: "",
        email: "",
        sala: "",
        fecha: "",
        turno: "",
        personas: "",
      },
      salasPermitidas,
      turnosPermitidos,
    });
  }

  async function detalle(req, res) {
    const reserva = await servicio.buscarPorId(req.params.id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "La reserva solicitada no existe.",
      });
    }

    res.render("reservas/detalle", {
      titulo: "Detalle de reserva",
      reserva,
    });
  }

  async function crear(req, res) {
    await servicio.crear(req.reservaValidada);
    res.redirect("/reservas");
  }

  return {
    inicio,
    estado,
    listar,
    mostrarFormulario,
    detalle,
    crear,
  };
}

module.exports = { crearControladorReservas };
