const mongoose = require('mongoose')

const asistenciaSesionEsquema = new mongoose.Schema({
    fechaSesion: String,
    idSesion: Number,
    idClase: Number,
    idSeccion: Number,
    asistentes: { type : Array , "default" : [] }
});

module.exports = mongoose.model('asistenciasSesiones',asistenciaSesionEsquema);