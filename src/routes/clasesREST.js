const express = require('express');
const router = express.Router();

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
    await clase.insertMany(e);

    // Enlaza a curso
    const _id = req.params.id;
    const filter = _id

    await curso.findById(filter, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se pudo encontrar el Curso de la seccion");
        } else {
            if (docs) {
                var cursoE = docs;
                cursoE.clases.push(e);
                console.log(cursoE);
                const update = { clases: cursoE.clases };

                curso.findByIdAndUpdate(filter, update, function (err, docs) {
                    if (err) {
                        //Si la base de datos está desconectada...
                        res.status(404).send("Error! No se encontró un curso con esa ID");
                    } else {
                        res.status(200);
                    }
                });
            }
        }
    });
});

// Exporta el router para ser utilizado en controlador
module.exports = router;