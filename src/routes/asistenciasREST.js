const express = require('express');
const router = express.Router();
var utlidades = require("../utilidades");

// Modelos a utilizar
const clase = require('../models/clase');
const curso = require('../models/curso');
const seccion = require('../models/seccion');
const asistencia = require('../models/asistenciaSesion');


//Mongoose
const mongoose = require('mongoose');

// ----- REST

// ASISTENCIAS

// POST
router.post('/asistencias', async(req,res) =>{
    var e = new asistencia(req.body);

    // Consigue el ID mas reciente
    const x = await asistencia.find();
    e.id = utlidades.siguienteID(x)

    // Lee el archivo (ya que solo existe uno) para encontrar valores de fecha y asistentes
    const datos = utlidades.leerArchivo(req.body.archivo)
    // 0 es asistentes, 1 es fecha
    e.asistentes = datos[0];
    e.fecha = datos[1];
    

    // Busca que exista la seccion
    await seccion.findOne({id:e.idSeccion},function(err,docs){
        if(err){
            res.status(503).send("Error al buscar seccion de asistencia.")
        }else{
            if(docs){
                // No ocupa guardar la referencia

                // Busca que exista la clase
                clase.findOne({id:e.idClase},function(err,docs){
                    if(err){
                        res.status(503).send("Error al buscar clase de asistencia.")
                    }else{
                        if(docs){
                            // Guarda la referencia
                            const claseE = docs;
                            // Agrega los asistentes a alumnos de clase
                            claseE.alumnos = utlidades.combinarArreglos(claseE.alumnos,e.asistentes)
                            // Agrega la sesion a la lista en la clase
                            claseE.sesiones.push(e)

                            // Actualiza en la BD
                            clase.findOneAndUpdate({id:e.idClase},{alumnos:claseE.alumnos,sesiones:claseE.sesiones},function (err,docs){
                                if(err){
                                    res.status(503).send("No se pudo actualizar la clase con las asistencias.")
                                }else{
                                    if(docs){

                                        // Ahora a actualizar curso...
                                        curso.findOne({id:claseE.idCurso}, function(err,docs){
                                            if(err){
                                                res.status(503).send("No se pudo encontrar el curso con las asistencias.")
                                            }else{
                                                if(docs){
                                                    // Guarda referencia
                                                    const cursoE = docs;
                                                    // Busca la clase que se modifico
                                                    cursoE.clases.forEach(function(claseEl, index){
                                                        if(claseEl.id==claseE.id)
                                                            this[index] = claseE;
                                                    },cursoE.clases)
                                                    // Actualiza en la base de datos
                                                    curso.findOneAndUpdate({id:cursoE.id},{clases:cursoE.clases},function(err,docs){
                                                        if(err){
                                                            res.status(503).send("No se pudo actualizar el curso con las asistencias.")
                                                        }else{
                                                            if(docs){
                                                                // Mete las asistencias en si a la base de datos
                                                                asistencia.insertMany(e)
                                                                res.status(200).send("Asistencias registradas.")
                                                            }else{
                                                                res.status(404).send("Aparentemente no existe el curso aunque ya se habia validado antes, chale.")
                                                            }
                                                        }
                                                    })
                                                }else{
                                                    res.status(404).send("No se encuentra el curso a actualizar.")
                                                }
                                            }
                                        })
                                        
                                    }else{
                                        res.status(404).send("No existe la clase de esa asistencia.")
                                    }
                                }
                            })

                        }else{
                            res.status(404).send("No existe la clase de esa asistencia.")
                        }
                    }
                })

            }else{
                res.status(404).send("No existe la seccion de esa asistencia.")
            }
        }
    })


})

// Exporta el router para ser utilizado en controlador
module.exports = router;