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

    // Revisa que el curso posteado no esté repetido
    var repetido = false;
    x.forEach(curso => {
        if (curso.nombre == e.nombre) {
            // Si tienen el mismo nombre, es repetido
            repetido = true;
        }
    })

    // Envia un status 400 Bad Request
    if (repetido) {
        res.status(400).send("Ya existe un curso con ese nombre.")
    } else {

        // Separa secciones y clases del curso
        var secciones = e.secciones
        var clases = e.clases

        // Vacia las secciones y clases del curso
        e.secciones = [];
        e.clases = [];

        // Busca el ID siguiente usando la lista de cursos obtenida arriba
        e.id = utlidades.siguienteID(x)

        await curso.insertMany(e, function (err, docs) {
            if (err) {
                //Si la base de datos está desconectada u ocurre algún inconveniente
                res.status(503).send("Error! No se pudo agregar el Curso");
            } else {
                // Si llegaron secciones en el cuerpo del mensaje...
                if(secciones.length > 0){
                    // Postea las secciones
                    postSecciones(docs[0], res, secciones, clases);

                //Si llegaron clases en el cuerpo del mensaje pero no secciones
                }else if(clases.length > 0){
                    //Postea las clases
                    postClases(docs[0], res, clases);
                }else{
                    res.status(200).send("Curso registrado con éxito");
                }
            }
        });
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

    // Por cada seccion
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
    }

    // Primero enlaza a curso, despues anadie a la base de datos (por si el curso es invalido)
    // ID del Curso en el cuerpo
    const id = doc.id;

    // Filtro para encontrar el curso
    const filter = { id: id };

    // Busca un curso con el ID en filter
    await curso.findOne(filter, function (err, docs) {
        if (err) {
            // Recurso no encontrado
            res.status(404).send("Error! No se pudo encontrar el Curso de la seccion que intentas agregar");
        } else {
            // Si hay un document...
            if (docs) {
                // cursoE es igual al documento
                const cursoE = docs;

                // Por cada sección en el arreglo final
                arregloFinal.forEach(x => {
                    // Se agrega a las secciones de cursoE
                    cursoE.secciones.push(x);
                })
                console.log(cursoE);

                // Establece el contenido a actuaizar
                const update = { secciones: cursoE.secciones };

                // Busca el curso con ID en filter y actualiza co nel contenido en Update
                curso.findOneAndUpdate(filter, update, function (err, docs) {
                    if (err) {
                        //Si la base de datos está desconectada...
                        res.status(404).send("Error! No se encontró un curso con esa ID");
                    } else {
                        // Guarda las secciones finales
                        seccion.insertMany(arregloFinal);

                        // Si hay clases que registrar
                        if(clases.length > 0){
                            postClases(doc, res, clases);
                        }else{
                            res.status(200).send("Curso y secciones registrados");
                        }
                    }
                });
            } else {
                res.status(404).send("Error! No se encontró un curso con esa ID");
            }
        }
    });
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
    }

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
                });

                const update = { clases: cursoE.clases };

                curso.findOneAndUpdate(filter, update, function (err, docs) {
                    if (err) {
                        // Recurso no encontrado
                        res.status(404).send("Error! No se encontró un curso con esa ID");
                    } else {
                        // Guarda la clase en si
                        clase.insertMany(arregloFinal);
                        
                        res.status(200).send("Curso, clases y secciones registrados");
                    }
                });
            } else {
                res.status(404).send("Error! No se encontró un curso con esa ID");
            }
        }
    });
}

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
            res.status(503).send("Error! No se pudo acceder a los cursos");
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