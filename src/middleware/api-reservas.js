const { salasPermitidas, turnosPermitidos } = require("./reservas");

function validarReservaApi(req, res, next) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({
      error: "El cuerpo de la solicitud debe ser un objeto JSON.",
    });
  }

  const campos = ["estudiante", "email", "sala", "fecha", "turno", "personas"];

  const datos = {};

  for (const campo of campos) {
    if (!Object.hasOwn(req.body, campo)) {
      return res.status(400).json({
        error: `El campo ${campo} es obligatorio.`,
      });
    }

    datos[campo] = req.body[campo];
  }

  const errores = [];

  for (const campo of ["estudiante", "email", "sala", "fecha", "turno"]) {
    if (typeof datos[campo] !== "string") {
      errores.push(`El campo ${campo} debe ser texto.`);
    } else {
      datos[campo] = datos[campo].trim();

      if (!datos[campo]) {
        errores.push(`El campo ${campo} es obligatorio.`);
      }
    }
  }

  if (
    typeof datos.email === "string" &&
    datos.email &&
    !datos.email.includes("@")
  ) {
    errores.push("El email debe contener @.");
  }

  if (
    typeof datos.sala === "string" &&
    datos.sala &&
    !salasPermitidas.includes(datos.sala)
  ) {
    errores.push("La sala seleccionada no es válida.");
  }

  if (
    typeof datos.turno === "string" &&
    datos.turno &&
    !turnosPermitidos.includes(datos.turno)
  ) {
    errores.push("El turno seleccionado no es válido.");
  }

  if (
    typeof datos.personas !== "number" ||
    !Number.isInteger(datos.personas) ||
    datos.personas < 1 ||
    datos.personas > 6
  ) {
    errores.push(
      "La cantidad de personas debe ser un número entero entre 1 y 6.",
    );
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: "Los datos enviados no son válidos.",
      errores,
    });
  }

  req.reservaValidada = datos;
  next();
}

module.exports = { validarReservaApi };
