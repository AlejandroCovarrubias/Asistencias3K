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
        }

        //path
        const { path } = files.file[0];

        //obtener el nombre temporal del archivo
        let filename = path.split('/');
        filename = filename[filename.length - 1];

        //mover archivo en el directorio
        return fs.rename(path, './files/' + 'archivoparaleer.csv', error => {
            if (error) {
                return res.status(400).send({ error });
            }
            return res.status(200).send({ file: filename });
        });
    });
});


// Exporta el router para ser utilizado en controlador
module.exports = router;