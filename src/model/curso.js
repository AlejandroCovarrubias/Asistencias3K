const mongoose = require('mongoose')

const cursoEsquema = new mongoose.Schema({
    idS: String,
    nombre: String
});

module.exports = mongoose.model('cursos',cursoEsquema);