const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const cors = require('cors');
const fs = require('fs');
const folder = 'files/';

// CORS configurations
router.use(cors());

// Modelos a utilizar
const curso = require('../model/curso')
//const session = require('../models/sesion')
//const clase = require('../models/clase')
//const alumno = require('../models/alumno')

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
    const cursoE = await curso.findOne({ idS:id}, function(err, docs){
        if (err){
            console.log(err)
            res.send("Error! No se encontro ese ID.")
        }else{
            res.send(docs)
        }
    });
});

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