const express = require('express');
const router = express.Router();
var utlidades = require("../utilidades");


// Modelos a utilizar
const curso = require('../models/curso');
const seccion = require('../models/seccion');
const clase = require('../models/clase');

//Mongoose
const mongoose = require('mongoose');

// ----- REST

// Cursos

// GET todos
router.get('/cursos', async (req, res) => {
    await curso.find(function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se pudo acceder a los cursos");
        } else {
            res.status(200).send(docs);
        }
    });
});

//GET especifico
router.get('/cursos/:id', async (req, res) => {
    const id = req.params.id
    const filter = { id: id }
    await curso.findOne(filter, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se pudo acceder a los cursos");
        } else {
            if (docs) {
                res.status(200).send(docs);
            } else {
                res.status(404).send("No se encontró un curso con ese ID");
            }
        }
    });
});

// POST
router.post('/cursos', async (req, res) => {
    var e = new curso(req.body);
    // Consigue el ID mas reciente
    const x = await curso.find();
    e.id = utlidades.siguienteID(x)

    await curso.insertMany(e, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se pudo agregar el Curso");
        } else {
            res.status(200).send(docs);
        }
    });
});

// PUT
router.put('/cursos/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { id: id };
    const update = {
        nombre: req.body.nombre
    };
    await curso.findOneAndUpdate(filter, update, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se pudo acceder a los cursos");
        } else {
            if (docs) {
                res.status(200).send("Curso actualizado exitosamente");
            } else {
                res.status(404).send("Error! No se pudo encontrar el curso con ese ID.");
            }
        }
    });
})

// DELETE
router.delete('/cursos/:id', async (req, res) => {
    const filter = { id: req.params.id };

    const cursoE = await curso.findOne(filter, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se pudo acceder a los cursos");
            return;
        } else {
            if (docs) {
                // Guarda la referencia
                const cursoE = docs;

                // Elimina secciones relevantes
                // Itera por secciones
                cursoE.secciones.forEach(element => {
                    seccion.findOneAndDelete({ id: element.id }, function (err, docs) {
                        if (err) {
                            console.log("Error al eliminar seccion con ID: " + element.id)
                        } else {
                            if (docs) {
                                console.log("Eliminado seccion con ID: " + element.id)
                            } else {
                                console.log("Error al eliminar seccion con ID: " + element.id + " No existe?")
                            }
                        }
                    })

                });

                // Elimina clases relevantes
                // Itera por clases
                cursoE.clases.forEach(element => {
                    clase.findOneAndDelete({ id: element.id }, function (err, docs) {
                        if (err) {
                            console.log("Error al eliminar clase con ID: " + element.id)
                        } else {
                            if (docs) {
                                console.log("Eliminado clase con ID: " + element.id)
                            } else {
                                console.log("Error al eliminar clase con ID: " + element.id + " No existe?")
                            }
                        }
                    })

                });

                // Elimina el curso en si
                curso.findOneAndDelete(filter, function (errx, docsx) {
                    if (errx) {
                        res.status(404).send("Error! No se pudo acceder a los cursos");
                    } else {
                        res.status(200).send("Curso eliminado");
                    }
                });
            } else {
                res.status(404).send("Error! Ese curso con ese ID no se puede encontrar.");
            }
        }
    })


})

// Exporta el router para ser utilizado en controlador
module.exports = router;