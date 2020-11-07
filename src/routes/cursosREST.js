const express = require('express');
const router = express.Router();

// Modelos a utilizar
const curso = require('../models/curso');

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
    const _id = req.params.id;
    console.log(_id);

    if (mongoose.isValidObjectId(_id)) {
        await curso.findById({ _id }, function (err, docs) {
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
    } else {
        res.status(404).send("Error! ID no válido. No se pudo obtener el curso");
    }
});

// POST
router.post('/cursos', async (req, res) => {
    var e = new curso(req.body);
    console.log(e);
    await curso.insertMany(e, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se pudo agregar el Curso");
        } else {
            res.status(200).send("Curso agregado exitosamente");
        }
    });
});

// PUT
router.put('/cursos/:id', async (req, res) => {
    const _id = req.params.id;
    const filter = _id;
    const update = {
        nombre: req.body.nombre
    };

    if (mongoose.isValidObjectId(_id)) {
        await curso.findByIdAndUpdate(filter, update, function (err, docs) {
            if (err) {
                //Si la base de datos está desconectada...
                res.status(404).send("Error! No se pudo acceder a los cursos");
            } else {
                res.status(200).send("Curso actualizado exitosamente");
            }
        });
    } else {
        res.status(404).send("Error! ID no válido. No se pudo actualizar el curso");
    }
})

// DELETE
router.delete('/cursos/:id', async (req, res) => {
    const _id = req.params.id;

    if (mongoose.isValidObjectId(_id)) {
        await curso.findByIdAndDelete({ _id }, function (err, docs) {
            if (err) {
                res.status(404).send("Error! No se pudo acceder a los cursos");
            } else {
                res.status(200).send("Curso eliminado");
            }
        });
    } else {
        res.status(404).send("Error! ID no válido. No se pudo eliminar el curso");
    }
})

// Exporta el router para ser utilizado en controlador
module.exports = router;