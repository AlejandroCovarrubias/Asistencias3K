const mongoose = require('mongoose')

const alumnoClaseEsquema = new mongoose.Schema({
    id: String,
    idAlumno: String,
    idClase: String,
    sesionesAsistidas: { type : Array , "default" : [] }
});

module.exports = mongoose.model('alumnosClases',alumnoClaseEsquema);