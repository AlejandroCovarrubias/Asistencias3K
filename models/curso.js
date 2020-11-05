const mongoose = require('mongoose')

const cursoEsquema = new mongoose.Schema({
    idUsuario: Number,
    idCurso: Number,
    nombre: String,
    secciones: { type : Array , "default" : [] },
    clases: { type : Array , "default" : [] }
});

module.exports = mongoose.model('cursos',cursoEsquema);