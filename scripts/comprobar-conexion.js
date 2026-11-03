const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");

async function main() {
  try {
    await conectarBaseDatos();
    console.log("Conexión con MongoDB establecida correctamente.");
  } finally {
    await desconectarBaseDatos();
  }
}

main().catch((error) => {
  console.error("No se pudo establecer la conexión con MongoDB.");
  console.error(`Tipo de error: ${error.name}`);
  process.exitCode = 1;
});
