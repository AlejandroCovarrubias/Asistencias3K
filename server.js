const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({ extended: true }));


// Conectarse a la base de datos.
mongoose.connect('mongodb://localhost/MA3K')
    .then(db => console.log(">> Atención: Conectado a la base de datos."))
	.catch(err => console.log(">> Error: " + err));
	
// Importar rutas.
const indices = require('./src/routes/routes');
app.use('/', indices);

// Abriendo server.
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port 8080`));