const mongoose = require('mongoose')

const claseEsquema = new mongoose.Schema({
    idClase: Number,
    idCurso: Number,
    nombre: String,
    alumnos: { type : Array , "default" : [] },
    sesiones: { type : Array , "default" : [] }
});

module.exports = mongoose.model('clases',claseEsquema);