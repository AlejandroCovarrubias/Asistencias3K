const mongoose = require('mongoose')

const alumnoEsquema = new mongoose.Schema({
    id: String,
    nombre: String,
    asistencias: { type : Array , "default" : [] }
});

module.exports = mongoose.model('alumnos',alumnoEsquema);