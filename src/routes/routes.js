const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const cors = require('cors');
const fs = require('fs');

// CORS configurations
router.use(cors());

//--------------
//POST file
router.post('/uploadFile', (req, res) => {
    //inicializar multiparty
    const form = new multiparty.Form();

    return form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).send({ error: err });
        }else{
            //path
            var archivo = files.file[0];
            console.log("ARCHIVO:"+archivo)

            var e = new asistencia(req.body);

            // Consigue el ID mas reciente
            const x = await asistencia.find();
            e.id = utlidades.siguienteID(x)

            // Lee el archivo (ya que solo existe uno) para encontrar valores de fecha y asistentes
            const datos = utlidades.leerArchivo(archivo)
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
                    
                    
                }
    });
    }
);


// Exporta el router para ser utilizado en controlador
module.exports = router;