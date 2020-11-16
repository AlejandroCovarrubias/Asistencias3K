const mongoose = require('mongoose')

const usuarioEsquema = new mongoose.Schema({
    id: String,
    nombre: String,
    correo: String,
    pass: String
});

module.exports = mongoose.model('usuarios',usuarioEsquema);