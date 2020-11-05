const mongoose = require('mongoose')

const usuarioEsquema = new mongoose.Schema({
    idUsuario: Number,
    nombre: String,
    correo: String,
    pass: String
});

module.exports = mongoose.model('usuarios',usuarioEsquema);