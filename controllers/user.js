'use strict'

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando controlador de usuarios y la accion de pruebas'
    });

}

module.exports = {
    pruebas
};