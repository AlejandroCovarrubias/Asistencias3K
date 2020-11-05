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

// REST

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
    //console.log(req.body);
    var e = new curso(req.body);
    await curso.insertMany(e);
    res.redirect('/');
});

// PUT
router.put('/cursos/:id', async(req,res)=>{
    const id = req.params.id;
    const filter = { idCurso: id}
    const update = { idUsuario: req.body.idUsuario , idCurso: req.body.idCurso, nombre: req.body.nombre, 
                     secciones: req.body.secciones, clases: req.body.clases}
    await curso.findOneAndUpdate(filter, update)
    res.redirect('/');
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