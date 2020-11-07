const express = require('express');
const router = express.Router();

// Modelos a utilizar
const curso = require('../models/curso');
const seccion = require('../models/seccion');

//ObjectID de Mongo
const mongoose = require('mongoose');

// Secciones

//NO necesitamos un GET para todas las secciones, deberiamos removerlo
// GET todos
router.get('/secciones', async (req, res) => {
    await seccion.find(function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se pudo acceder a las secciones");
        } else {
            res.status(200).send(docs);
        }
    });
});

//GET especifico
router.get('/secciones/:id', async (req, res) => {
    const _id = req.params.id;

    if (mongoose.isValidObjectId(_id)) {
        await seccion.findById({ _id }, function (err, docs) {
            if (err) {
                //Si la base de datos está desconectada...
                res.status(404).send("Error! No se pudo acceder a las secciones");
            } else {
                //Revisa si es algo xD Como odio javascript
                if (docs) {
                    res.status(200).send(docs);
                } else {
                    res.status(404).send("No se encontró una seccion con ese ID");
                }
            }
        });
    } else {
        res.status(404).send("Error! ID no válido. No se pudo obtener la seccion");
    }
});

// POST
router.post('/secciones/:id', async (req, res) => {
    var e = new seccion(req.body);
    await seccion.insertMany(e);

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
                cursoE.secciones.push(e);
                console.log(cursoE);
                const update = { secciones: cursoE.secciones };

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

// PUT
router.put('/secciones/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { idSeccion: id }
    const update = { nombre: req.body.nombre }

    const seccionE = await seccion.findOne(filter)

    await seccion.findOneAndUpdate(filter, update)

    // Actualiza el curso

    const cursoE = await curso.findOne({ idCurso: seccionE.idCurso })
    // Busca la seccion a modificar dentro del curso
    const index = cursoE.secciones.findIndex((el) => el.idSeccion === id);

    // Por si las dudas checa que lo encuentra
    if (index !== -1) {
        // Modifica
        cursoE.secciones[index].nombre = req.body.nombre

        await curso.findOneAndUpdate({ idCurso: seccionE.idCurso }, { secciones: cursoE.secciones })
    } else {
        console.log("No encontre chavo")
    }
    res.redirect('/secciones');
})

router.delete('/secciones/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { idSeccion: id }
    const seccionE = await seccion.findOne(filter)

    // Elimina de curso

    const cursoE = await curso.findOne({ idCurso: seccionE.idCurso })

    // Busca la seccion a eliminar dentro del curso
    const index = cursoE.secciones.findIndex((el) => el.idSeccion === id);

    // Por si las dudas checa que lo encuentra
    if (index !== -1) {
        // Elimina
        cursoE.secciones.splice(index, 1)

        await curso.findOneAndUpdate({ idCurso: seccionE.idCurso }, { secciones: cursoE.secciones })
    }
    // Elimina la seccion en si

    await seccion.findOneAndDelete(filter)

    res.redirect('/secciones')
})

// Exporta el router para ser utilizado en controlador
module.exports = router;