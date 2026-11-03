const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");

const Reserva = require("../src/modelos/reserva");

async function listarReservas() {
  try {
    await conectarBaseDatos();

    const reservas = await Reserva.find().lean();

    if (reservas.length === 0) {
      console.log("La colección reservas está vacía.");
      return;
    }

    console.log(`Se encontraron ${reservas.length} reserva(s):`);

    for (const reserva of reservas) {
      console.log(JSON.stringify(reserva, null, 2));
    }
  } catch (error) {
    console.error("No se pudieron listar las reservas:", error.message);
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
    console.log("Conexión finalizada correctamente.");
  }
}

listarReservas();
