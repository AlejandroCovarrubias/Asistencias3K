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
            res.status(503).send("Error! No se pudo acceder a los cursos");
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
            res.status(503).send("Error! No se pudo acceder a los cursos");
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
    // Crea una entidad curso usando el cuerpo del mensaje
    var e = new curso(req.body);

    // Busca en la BD todos los cursos
    const x = await curso.find();

    // Revisa que no este vacio o sean puros espacios
    e.nombre = e.nombre.trim()
    if(e.nombre.length > 0){

        // Revisa que no este repetido
        var repetido = false;
        x.forEach(curso => {
            if (curso.nombre == e.nombre) {
                repetido = true;
            }
        })

        if (repetido) {
            res.status(400).send("Ya existe un curso con ese nombre.")
        } else {

            // Separa secciones y clases del cuerpo
            var secciones = e.secciones
            var clases = e.clases
            e.secciones = [];
            e.clases= [];

            e.id = utlidades.siguienteID(x)

            await curso.insertMany(e, function (err, docs) {
                if (err) {
                    //Si la base de datos está desconectada...
                    res.status(503).send("Error! No se pudo agregar el Curso");
                } else {
                    //res.status(200).send(docs);
                    postSecciones(docs[0], res, secciones, clases);
                }
            });
        }
    }else{
        res.status(400).send("No se aceptan cursos con nombres vacios.")
    }
});

// POST
async function postSecciones(doc, res, secciones, clases) {
    // Crea una variable para hacer dump de las secciones con los ID nuevos
    var arregloFinal = [];

    // Busca las secciones en la BD
    const y = await seccion.find();

    // Busca el ID más reciente
    var IDmas = +0;
    var IDinicial = utlidades.siguienteID(y);

    var unoVacio = false;

    for (var key in secciones) {
        // Crea una seccion temporal
        var e = new seccion(secciones[key]);

        // Le coloca el ID que llegó en el cuerpo del mensaje
        // Y calcula el resto
        e.idCurso = doc.id;
        e.id = +IDinicial + +IDmas;
        IDmas = +IDmas + 1;

        // Agrega la seccion editada en el arreglo final
        arregloFinal.push(e)
        if(e.nombre.trim().lenght==0){
            unoVacio = true;
        }
    }


    // No permite vacios o puros espcaios
    if(unoVacio){
        res.status(400).send("Alguno de las clases enviadas no tienen nombre.")
    }else{
        // Primero enlaza a curso, despues anadie a la base de datos (por si curso invalido)
        // Enlaza a curso
        const id = doc.id;
        const filter = { id: id };

        await curso.findOne(filter, function (err, docs) {
            if (err) {
                //Si la base de datos está desconectada...
                res.status(503).send("Error! No se pudo encontrar el Curso de la seccion");
            } else {
                if (docs) {
                    const cursoE = docs;
                    arregloFinal.forEach(x => {
                        cursoE.secciones.push(x);
                    })
                    console.log(cursoE);
                    const update = { secciones: cursoE.secciones };

                    curso.findOneAndUpdate(filter, update, function (err, docs) {
                        if (err) {
                            //Si la base de datos está desconectada...
                            res.status(503).send("Error! No se encontró un curso con esa ID");
                        } else {
                            // Guarda la seccion en si
                            seccion.insertMany(arregloFinal);
                            //res.status(200).send("Actualizado el curso con la seccion agregada.");
                            postClases(doc, res, clases);
                        }
                    });
                } else {
                    res.status(404).send("No se encontró un curso con ese ID");
                }
            }
        });
    }
}

async function postClases(doc, res, clases) {
    //Crea una variable para hacer dump de las clases con los ID nuevos
    var arregloFinal = [];

    // Busca las clases en la BD
    const y = await clase.find();

    // Busca el ID más reciente
    var IDmas = +0;
    var IDinicial = utlidades.siguienteID(y);

    for (var key in clases) {
        var e = new clase(clases[key]);
        e.idCurso = doc.id;
        e.id = +IDinicial + +IDmas;
        IDmas = +IDmas + 1;
        arregloFinal.push(e)
        if(e.nombre.trim().lenght==0){
            unoVacio = true;
        }
    }

    // No permite vacios o puros espcaios
    if(unoVacio){
        res.status(400).send("Alguno de las clases enviadas no tienen nombre.")
    }else{
        // Primero enlaza a curso, despues anadie a la base de datos (por si curso invalido)
        // Enlaza a curso
        const id = doc.id;
        const filter = { id: id }

        await curso.findOne(filter, function (err, docs) {
            if (err) {
                //Si la base de datos está desconectada...
                res.status(503).send("Error! No se pudo encontrar el Curso de la seccion");
            } else {
                if (docs) {
                    const cursoE = docs;
                    arregloFinal.forEach(x => {
                        cursoE.clases.push(x);
                    })
                    console.log(cursoE);
                    const update = { clases: cursoE.clases };

                    curso.findOneAndUpdate(filter, update, function (err, docs) {
                        if (err) {
                            //Si la base de datos está desconectada...
                            res.status(503).send("Error! No se encontró un curso con esa ID");
                        } else {
                            // Guarda el curso en si
                            clase.insertMany(arregloFinal);

                            // Busca de nuevo el curso xd
                            curso.findOne({id:doc.id}, function(err,docs){
                                if(err){
                                    res.status(503).send("Error en la base de datos al guardar curso.")
                                }else{
                                    if(docs){
                                        res.status(200).send(docs);
                                    }else{
                                        res.status(404).send("Hay mama, en lo que hiciste todo eso ya no existe el curso")
                                    }
                                }
                            })
                        }
                    });
                } else {
                    res.status(404).send("No se encontró un curso con ese ID");
                }
            }
        });
    }
}

// PUT
router.put('/cursos/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { id: id };
    
    // Revisa que no este vacio o sean puros espacios
    e.nombre = e.nombre.trim()
    
    if(e.nombre.lenght>0){
        const update = {
            nombre: req.body.nombre
        };
        
        await curso.findOneAndUpdate(filter, update, function (err, docs) {
            if (err) {
                //Si la base de datos está desconectada...
                res.status(503).send("Error! No se pudo acceder a los cursos");
            } else {
                if (docs) {
                    res.status(200).send("Curso actualizado exitosamente");
                } else {
                    res.status(404).send("Error! No se pudo encontrar el curso con ese ID.");
                }
            }
        });
    }else{
        res.status(400).send("No se aceptan cursos con nombres vacios.")
    }
})

// DELETE
router.delete('/cursos/:id', async (req, res) => {
    const filter = { id: req.params.id };

    const cursoE = await curso.findOne(filter, function (err, docs) {
        if (err) {
            //Si la base de datos está desconectada...
            res.status(503).send("Error! No se pudo acceder a los cursos");
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
                        res.status(503).send("Error! No se pudo acceder a los cursos");
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