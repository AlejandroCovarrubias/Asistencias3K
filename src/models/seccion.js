const mongoose = require('mongoose')

const seccionEsquema = new mongoose.Schema({
    id: String,
    idCurso: String,
    nombre: String
});

module.exports = mongoose.model('secciones',seccionEsquema);