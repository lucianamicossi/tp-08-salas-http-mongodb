const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
    estudiante: {
      type: String,
      required: [true, "El estudiante es obligatorio."],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "El email es obligatorio."],
      trim: true,
      match: [/@/, "El email debe contener @."],
    },

    sala: {
      type: String,
      required: [true, "La sala es obligatoria."],
      enum: ["Sala Norte", "Sala Sur", "Sala Multimedia"],
      trim: true,
    },

    fecha: {
      type: String,
      required: [true, "La fecha es obligatoria."],
      trim: true,
    },

    turno: {
      type: String,
      required: [true, "El turno es obligatorio."],
      enum: ["Mañana", "Tarde", "Noche"],
      trim: true,
    },

    personas: {
      type: Number,
      required: [true, "La cantidad de personas es obligatoria."],
      min: [1, "Debe haber al menos 1 persona."],
      max: [6, "No se permiten más de 6 personas."],
      validate: {
        validator: Number.isInteger,
        message: "La cantidad de personas debe ser un número entero.",
      },
    },

    estado: {
      type: String,
      enum: ["pendiente", "confirmada"],
      default: "pendiente",
    },
  },
  {
    collection: "reservas",
  },
);

const Reserva = mongoose.model("Reserva", reservaSchema);

module.exports = Reserva;
