const mongoose = require('mongoose')

const alumnoClaseEsquema = new mongoose.Schema({
    idAlumno: String,
    idClase: String,
    sesionesAsistidas: { type : Array , "default" : [] }
});

module.exports = mongoose.model('alumnosClases',alumnoClaseEsquema);