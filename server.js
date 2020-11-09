const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const app = express();

//app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conectarse a la base de datos.
mongoose.connect('mongodb://localhost/MA3K')
    .then(db => console.log(">> Atención: Conectado a la base de datos."))
	.catch(err => console.log(">> Error: " + err));
	
// Importar rutas.
const indices = require('./src/routes/routes');
const cursos = require('./src/routes/cursosREST');
const secciones = require('./src/routes/seccionesREST');
const clases = require('./src/routes/clasesREST');

app.use('/', indices);
app.use('/', cursos);
app.use('/', secciones);
app.use('/', clases);

// Abriendo server.
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port 8080`));