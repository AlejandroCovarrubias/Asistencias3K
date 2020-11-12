const express = require('express');
const router = express.Router();
var utlidades = require("../utilidades");

// Modelos a utilizar
const clase = require('../models/clase');
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
    const datos = utlidades.leerArchivo('./files/archivoparaleer.csv')
    // 0 es asistentes, 1 es fecha
    e.asistentes = datos[0];
    e.fecha = datos[1];
    

    // Busca que exista la seccion
    await seccion.findOne({id:e.idSeccion},function(err,docs){
        if(err){
            res.status(404).send("Error al buscar seccion de asistencia.")
        }else{
            if(docs){
                // No ocupa guardar la referencia

                // Busca que exista la clase
                clase.findOne({id:e.idCurso},function(err,docs){
                    if(err){
                        res.status(404).send("Error al buscar clase de asistencia.")
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
                                    res.status(404).send("No se pudo actualizar la clase con las asistencias.")
                                }else{
                                    if(docs){
                                        // Mete las asistencias en si a la base de datos
                                        asistencia.insertMany(e)
                                        res.status(200).send("Asistencias registradas.")
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