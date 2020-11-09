const express = require('express');
const router = express.Router();
var utlidades = require("../utilidades");

// Modelos a utilizar
const clase = require('../models/clase');
const curso = require('../models/curso');

//Mongoose
const mongoose = require('mongoose');

// ----- REST

// Clases

//POST
router.post('/clases/:id', async (req, res) => {
    var e = new clase(req.body);
    // Asegura que el ID curso se asigne por la ruta mejor
    e.idCurso = req.params.id;

    // Consigue el ID mas reciente
    const x = await clase.find();
    e.id = utlidades.siguienteID(x)
    

    // Enlaza a curso
    const id = req.params.id;
    const filter = {id:id}

    // Primero intenta agregar por curso, por si no existe
    await curso.findOne(filter, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se pudo encontrar el Curso de la seccion");
        }else{
            if(docs){
                // Guarda referencia
                const cursoE = docs;

                cursoE.clases.push(e);
                console.log(cursoE);
                const update = { clases: cursoE.clases };

                curso.findOneAndUpdate(filter, update, function (err, docs) {
                    if (err) {
                        //Si la base de datos está desconectada...
                        res.status(404).send("Error! No se encontró un curso con esa ID");
                    } else {
                        // Ahora si agregalas
                        clase.insertMany(e);
                        res.status(200).send("Clase agregada correctamente.");
                    }
                });
            }else{
                res.status(404).send("Error! No se pudo encontrar el Curso de la seccion");
            }
        }
    });

    
});

// Exporta el router para ser utilizado en controlador
module.exports = router;