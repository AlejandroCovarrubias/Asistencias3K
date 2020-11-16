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
const indices = require('./routes/routes');
const cursos = require('./routes/cursosREST');
const secciones = require('./routes/seccionesREST');
const clases = require('./routes/clasesREST');
const asistencias = require('./routes/asistenciasREST');

app.use('/', indices);
app.use('/', cursos);
app.use('/', secciones);
app.use('/', clases);
app.use('/', asistencias);

// Abriendo server.
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port 8080`));