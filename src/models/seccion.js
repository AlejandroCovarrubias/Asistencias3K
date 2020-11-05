const mongoose = require('mongoose')

const seccionEsquema = new mongoose.Schema({
    idSeccion: Number,
    idCurso: Number,
    nombre: String
});

module.exports = mongoose.model('secciones',seccionEsquema);