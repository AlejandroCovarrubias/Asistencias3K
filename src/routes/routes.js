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
            console.log("Me llego un archivo: "+files.file[0]);
        }
    });
});


// Exporta el router para ser utilizado en controlador
module.exports = router;