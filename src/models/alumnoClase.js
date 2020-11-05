const mongoose = require('mongoose')

const alumnoClaseEsquema = new mongoose.Schema({
    idAlumno: Number,
    idClase: Number,
    sesionesAsistidas: { type : Array , "default" : [] }
});

module.exports = mongoose.model('alumnosClases',alumnoClaseEsquema);