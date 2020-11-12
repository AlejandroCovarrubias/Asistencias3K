const mongoose = require('mongoose')

const asistenciaSesionEsquema = new mongoose.Schema({
    id: String,
    fechaSesion: String,
    idClase: String,
    idSeccion: String,
    asistentes: { type : Array , "default" : [] }
});

module.exports = mongoose.model('asistenciasSesiones',asistenciaSesionEsquema);