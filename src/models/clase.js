const mongoose = require('mongoose')

const claseEsquema = new mongoose.Schema({
    id: String,
    idCurso: String,
    nombre: String,
    alumnos: { type : Array , "default" : [] },
    sesiones: { type : Array , "default" : [] }
});

module.exports = mongoose.model('clases',claseEsquema);