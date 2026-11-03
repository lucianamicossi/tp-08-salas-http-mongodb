function leerConfiguracion(entorno = process.env) {
  const puerto = Number(entorno.PORT || 3000);

  if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
    throw new Error("La variable PORT debe ser un puerto válido.");
  }

  const formatoRegistro =
    entorno.NODE_ENV === "production" ? "combined" : "dev";

  return { puerto, formatoRegistro };
}

function leerUriMongoDB(entorno = process.env) {
  const uri = entorno.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("Falta configurar la variable MONGODB_URI en el entorno.");
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    throw new Error(
      "La variable MONGODB_URI debe comenzar con mongodb:// o mongodb+srv://.",
    );
  }

  return uri;
}

module.exports = { leerConfiguracion, leerUriMongoDB };
