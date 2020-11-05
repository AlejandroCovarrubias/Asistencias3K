const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const cors = require('cors');
const fs = require('fs');
const folder = 'files/';

// CORS configurations
router.use(cors());

// Modelos a utilizar
const alumno = require('../models/alumno')
const alumnoClase = require('../models/alumnoClase')
const asistenciaSesion = require('../models/asistenciaSesion')
const clase = require('../models/clase')
const curso = require('../models/curso')
const seccion = require('../models/seccion')
const usuario = require('../models/usuario')

// ----- REST

// Cursos

// GET todos
router.get('/cursos', async (req, res) => {
    const listacursos = await curso.find();
    //console.log(listacursos);
    res.send(listacursos)
});

//GET especifico
router.get('/cursos/:id', async (req,res) => {
    const id = req.params.id;
    const cursoE = await curso.findOne({ idCurso:id}, function(err, docs){
        if (err){
            console.log(err)
            res.send("Error! No se encontro ese ID.")
        }else{
            res.send(docs)
        }
    });
});

// POST
router.post('/cursos', async (req, res) => {
    var e = new curso(req.body);
    await curso.insertMany(e);
    res.redirect('/secciones');
});

// PUT
router.put('/cursos/:id', async(req,res)=>{
    const id = req.params.id;
    const filter = { idCurso: id}
    const update = { idUsuario: req.body.idUsuario , idCurso: req.body.idCurso, nombre: req.body.nombre, 
                     secciones: req.body.secciones, clases: req.body.clases}
    await curso.findOneAndUpdate(filter, update)
    res.redirect('/secciones');
})

router.delete('/cursos/:id', async(req,res)=>{
    const id = req.params.id;
    await curso.findOneAndDelete( {idCurso: id})
    res.redirect('/secciones')
})

// Secciones

// GET todos
router.get('/secciones', async (req, res) => {
    const listasecciones = await seccion.find();
    res.send(listasecciones)
});

//GET especifico
router.get('/secciones/:id', async (req,res) => {
    const id = req.params.id;
    const cursoE = await seccion.findOne({ idSeccion:id }, function(err, docs){
        if (err){
            console.log(err)
            res.send("Error! No se encontro ese ID.")
        }else{
            res.send(docs)
        }
    });
});

// POST
router.post('/secciones/:id', async (req, res) => {
    var e = new seccion(req.body);
    await seccion.insertMany(e);
    // Enlaza a curso
    const id = req.params.id;
    const filter = { idCurso: id}
    
    const cursoE = await curso.findOne(filter)
    cursoE.secciones.push(e)
    console.log(cursoE)

    const update = { secciones: cursoE.secciones }

    await curso.findOneAndUpdate(filter, update)
    res.redirect('/secciones');
});

// PUT
router.put('/secciones/:id', async(req,res)=>{
    const id = req.params.id;
    const filter = { idSeccion: id }
    const update = { nombre: req.body.nombre }
    
    const seccionE = await seccion.findOne(filter)

    await seccion.findOneAndUpdate(filter, update)

    // Actualiza el curso

    const cursoE = await curso.findOne( {idCurso: seccionE.idCurso} )
    // Busca la seccion a modificar dentro del curso
    const index = cursoE.secciones.findIndex((el) => el.idSeccion == id);

    // Por si las dudas checa que lo encuentra
    if(index != -1){
        // Modifica
        cursoE.secciones[index].nombre = req.body.nombre

        await curso.findOneAndUpdate( {idCurso: seccionE.idCurso}, {secciones: cursoE.secciones})
    }else{
        console.log("No encontre chavo")
    }
    res.redirect('/secciones');
})

router.delete('/secciones/:id', async(req,res)=>{
    const id = req.params.id;
    const filter = { idSeccion: id }
    const seccionE = await seccion.findOne(filter)

    // Elimina de curso
    
    const cursoE = await curso.findOne( {idCurso: seccionE.idCurso} )

    // Busca la seccion a eliminar dentro del curso
    const index = cursoE.secciones.findIndex((el) => el.idSeccion == id);

    // Por si las dudas checa que lo encuentra
    if(index != -1){
        // Elimina
        cursoE.secciones.splice(index,1)

        await curso.findOneAndUpdate( {idCurso: seccionE.idCurso}, {secciones: cursoE.secciones})
    }
    // Elimina la seccion en si
    
    await seccion.findOneAndDelete(filter)

    res.redirect('/secciones')
})




//--------------
//POST file
router.post('/uploadFile', (req, res) => {
    //inicializar multiparty
    const form = new multiparty.Form();

    return form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).send({error: err});
        }

        //path
        const {path} = files.file[0];

        //obtener el nombre temporal del archivo
        let filename = path.split('/');
        filename = filename[filename.length - 1];

        //mover archivo en el directorio
        return fs.rename(path, './files/' + 'archivoparaleer.csv', error => {
            if(error){
                return res.status(400).send({error});
            }
            return res.status(200).send({file: filename});
        });
    });
});




// Exporta el router para ser utilizado en controlador
module.exports = router;