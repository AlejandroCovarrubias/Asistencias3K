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

// GET
//GET especifico
router.get('/clases/:id', async (req, res) => {
    const id = req.params.id
    const filter = {id : id}
       await clase.findOne( filter , function (err, docs) {
           if (err) {
               //Si la base de datos está desconectada...
               res.status(404).send("Error! No se pudo acceder a las clases");
           } else {
               if (docs) {
                   res.status(200).send(docs);
               } else {
                   res.status(404).send("No se encontró una clase con ese ID");
               }
           }
       });
});

// PUT
router.put('/clases/:id', async (req, res) => {
    const id = req.params.id;
    const filter = {id:id}
    const update = { nombre: req.body.nombre }

    await clase.findOneAndUpdate(filter, update, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se encontró una clase con esa ID");
        }else{
            if(docs){
                // Guarda la referencia
                const claseE = docs;
                // Actualiza el curso
                curso.findOne({id:claseE.idCurso}, function(err,docs){
                    if (err) {
                        //Si la base de datos está desconectada...
                        res.status(404).send("Error! No se encontró el curso de esta clase");
                    }else{
                        if(docs){
                            // Guarda la referencia
                            const cursoE = docs;
                            // Busca la seccion a modificar dentro del curso
                            const index = cursoE.clases.findIndex((el) => el.id == id);

                            // Por si las dudas checa que lo encuentra
                            if (index !== -1) {
                                // Modifica
                                cursoE.clases[index].nombre = req.body.nombre

                                 curso.findOneAndUpdate({id:claseE.idCurso}, { clases: cursoE.clases }, function (err, docs) {
                                    if (err) {
                                        //Si la base de datos está desconectada...
                                        res.status(404).send("No se pudo actualizar el curso a donde pertenece la clase.");
                                    } else {
                                        res.status(200).send("Actualizada la clase correctamente.");
                                    }})
                            }
                        }else{
                            res.status(404).send("Error! No se encontró el curso de esta clase");
                        }
                    }
                })
                

            } else {
                res.status(404).send("No se encontró una clase con ese ID");
            }
        }
        })

    
})

// DELETE
router.delete('/clases/:id', async (req, res) => {
    const id = req.params.id;
    const filter = {id:id}
    await clase.findOne(filter, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se pudo encontrar una clase con ese ID");
        }else{
            if(docs){
                // Guarda la referencia
                const claseE = docs;

                // Elimina de curso
                curso.findOne({id:claseE.idCurso}, function(err,docs){
                    if (err) {
                    //Si la base de datos está desconectada...
                    res.status(404).send("Error! No se encontró un curso con la ID en la clase");
                }else{
                    if(docs){
                        // Guarda la referencia
                        const cursoE = docs;
                        // Busca la seccion a eliminar dentro del curso
                        const index = cursoE.clases.findIndex((el) => el.id == id);
                        // Por si las dudas checa que lo encuentra
                        if (index !== -1) {
                            // Elimina
                            cursoE.clases.splice(index, 1)
                            curso.findOneAndUpdate({id:claseE.idCurso}, { clases: cursoE.clases }, function(err,docs){
                                if(err){
                                    res.status(404).send("No se pudo eliminar la clase del curso")
                                }else{
                                    if(docs){
                                        console.log("Eliminado compa")
                                    }else{
                                        res.status(404).send("No se pudo eliminar la clase del curso x 2")
                                    }
                                }
                            })
                        }
                        // Elimina la seccion en si

                        clase.findOneAndDelete(filter, function (err, docs) {
                            if (err) {
                                //Si la base de datos está desconectada...
                                res.status(404).send("Error! No se encontró una clase con esa ID");
                            } else {
                                res.status(200).send("Clase eliminada correctamente");
                            }})
                        } else {
                                res.status(404).send("No se encontró una clase con ese ID");
                                return;
                            }
                    }})
                    } else {
                        res.status(404).send("Error! No se encontró un curso con la ID en la clase");
                    }
                }
                
            })

                

    

})

// Exporta el router para ser utilizado en controlador
module.exports = router;