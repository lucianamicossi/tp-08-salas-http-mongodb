const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");

const Reserva = require("../src/modelos/reserva");

async function crearReserva() {
  try {
    await conectarBaseDatos();

    const reserva = await Reserva.create({
      estudiante: "Juan Perez",
      email: "juan.prueba@example.com",
      sala: "Sala Norte",
      fecha: "2026-10-25",
      turno: "Mañana",
      personas: 2,
    });

    console.log("Reserva creada correctamente:");
    console.log(JSON.stringify(reserva.toObject(), null, 2));
  } catch (error) {
    console.error("No se pudo crear la reserva:", error.message);
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
    console.log("Conexión finalizada correctamente.");
  }
}

crearReserva();
