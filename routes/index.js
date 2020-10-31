const express = require('express');
const router = express.Router();

// Modelos a utilizar
const curso = require('../models/curso')
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




// Exporta el router para ser utilizado en controlador
module.exports = router;