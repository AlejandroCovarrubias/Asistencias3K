const express = require('express');
const router = express.Router();
var utlidades = require("../utilidades");


// Modelos a utilizar
const curso = require('../models/curso');
const seccion = require('../models/seccion');

//ObjectID de Mongo
const mongoose = require('mongoose');

// Secciones

//NO necesitamos un GET para todas las secciones, deberiamos removerlo
// GET todos
//router.get('/secciones', async (req, res) => {
//    await seccion.find(function (err, docs) {
//        if (err) {
//            //Si la base de datos está desconectada...
//            res.status(404).send("Error! No se pudo acceder a las secciones");
//        } else {
//            res.status(200).send(docs);
//        }
//    });
//});

//GET especifico
router.get('/secciones/:id', async (req, res) => {
    const id = req.params.id;

    await seccion.findOne({ id:id }, function (err, docs) {
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
});

// POST
router.post('/secciones/:id', async (req, res) => {
    var arregloFinal = [];

    // Consigue el ID mas reciente
    const y = await seccion.find();
    var IDmas = +0;
    var IDinicial = utlidades.siguienteID(y)

    for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            var e = new seccion(req.body[key]);
            e.idCurso = req.params.id;
            e.id = +IDinicial + +IDmas;
            IDmas = +IDmas + 1;
            arregloFinal.push(e)
        }
    }

    // Primero enlaza a curso, despues anadie a la base de datos (por si curso invalido)
    // Enlaza a curso
    const id = req.params.id;
    const filter = { id: id }

    await curso.findOne(filter, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se pudo encontrar el Curso de la seccion");
        } else{
            if(docs){
                const cursoE = docs;
                arregloFinal.forEach( x => {
                    cursoE.secciones.push(x);
                })
                console.log(cursoE);
                const update = { secciones: cursoE.secciones };
                
                curso.findOneAndUpdate(filter, update, function (err, docs) {
                    if (err) {
                        //Si la base de datos está desconectada...
                        res.status(404).send("Error! No se encontró un curso con esa ID");
                    } else {
                        // Guarda la seccion en si
                        console.log("ARREGLO")
                        console.log(arregloFinal)
                        seccion.insertMany(arregloFinal);
                        res.status(200).send("Actualizado el curso con la seccion agregada.");
                    }
                });
            } else {
                res.status(404).send("No se encontró un curso con ese ID");
            }
        }
    });
});

// PUT
router.put('/secciones/:id', async (req, res) => {
    const id = req.params.id;
    const filter = {id:id}
    const update = { nombre: req.body.nombre }

    await seccion.findOneAndUpdate(filter, update, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se encontró una seccion con esa ID");
        }else{
            if(docs){
                // Guarda la referencia
                const seccionE = docs;
                // Actualiza el curso
                curso.findOne({id:seccionE.idCurso}, function(err,docs){
                    if (err) {
                        //Si la base de datos está desconectada...
                        res.status(404).send("Error! No se encontró el curso de esta seccion");
                    }else{
                        if(docs){
                            // Guarda la referencia
                            const cursoE = docs;
                            // Busca la seccion a modificar dentro del curso
                            const index = cursoE.secciones.findIndex((el) => el.id == id);

                            // Por si las dudas checa que lo encuentra
                            if (index !== -1) {
                                // Modifica
                                cursoE.secciones[index].nombre = req.body.nombre

                                 curso.findOneAndUpdate({id:seccionE.idCurso}, { secciones: cursoE.secciones }, function (err, docs) {
                                    if (err) {
                                        //Si la base de datos está desconectada...
                                        res.status(404).send("Error! No se encontró una seccion con esa ID");
                                    } else {
                                        res.status(200).send("Actualizada la seccion correctamente.");
                                    }})
                            }
                        }else{
                            res.status(404).send("Error! No se encontró el curso de esta seccion");
                        }
                    }
                })
                

            } else {
                res.status(404).send("No se encontró una sesion con ese ID");
            }
        }
        })

    
})

// DELETE

router.delete('/secciones/:id', async (req, res) => {
    const id = req.params.id;
    const filter = {id:id}
    await seccion.findOne(filter, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(404).send("Error! No se pudo encontrar una seccion con ese ID");
        }else{
            if(docs){
                // Guarda la referencia
                const seccionE = docs;

                // Elimina de curso
                curso.findOne({id:seccionE.idCurso}, function(err,docs){
                    if (err) {
                    //Si la base de datos está desconectada...
                    res.status(404).send("Error! No se encontró un curso con la ID en la seccion");
                }else{
                    if(docs){
                        // Guarda la referencia
                        const cursoE = docs;
                        // Busca la seccion a eliminar dentro del curso
                        const index = cursoE.secciones.findIndex((el) => el.id == id);
                        // Por si las dudas checa que lo encuentra
                        if (index !== -1) {
                            // Elimina
                            cursoE.secciones.splice(index, 1)
                            curso.findOneAndUpdate({id:seccionE.idCurso}, { secciones: cursoE.secciones }, function(err,docs){
                                if(err){
                                    res.status(404).send("No se pudo eliminar la seccion del curso")
                                }else{
                                    if(docs){
                                        console.log("Eliminado compa")
                                    }else{
                                        res.status(404).send("No se pudo eliminar la seccion del curso x 2")
                                    }
                                }
                            })
                        }
                        // Elimina la seccion en si

                        seccion.findOneAndDelete(filter, function (err, docs) {
                            if (err) {
                                //Si la base de datos está desconectada...
                                res.status(404).send("Error! No se encontró una seccion con esa ID");
                            } else {
                                res.status(200).send("Seccion eliminada correctamente");
                            }})
                        } else {
                                res.status(404).send("No se encontró una seccion con ese ID");
                                return;
                            }
                    }})
                    } else {
                        res.status(404).send("Error! No se encontró un curso con la ID en la seccion");
                    }
                }
                
            })

                

    

})

// Exporta el router para ser utilizado en controlador
module.exports = router;