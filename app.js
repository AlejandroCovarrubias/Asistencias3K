const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({ extended: true }));

// Conectarse a la base de datos.
mongoose.connect('mongodb://localhost/MA3K')
    .then(db => console.log(">> Atención: Conectado a la base de datos."))
	.catch(err => console.log(">> Error: " + err));
	
// Importar rutas.
const indices = require('./routes/index');

// Configuración de vistas.
app.set('view engine', 'ejs'); // Va a utilizar un motor de pantilla ejs.
app.set('views', __dirname + '/views'); // Obtendrá las vistas de la carpeta views.
app.use('/', indices);

// Abriendo server.
app.listen(3000, () => {
    console.log("Express funcionando en puerto 3000...");
});