'use strict'

//modulos
var fs = require('fs');
var path = require('path');

//modelos
var User = require('../models/user');
var Animal = require('../models/animal');

// libs
var jwt = require('../services/jwt');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando controlador de usuarios y la accion de pruebas',
        user: req.user
    });

} // end pruebas

// saveAnimal
function saveAnimal(req, res) {
    var animal = new Animal();
    var params = req.body;

    console.log(req.user);
    if (params.name) {
        animal.name = params.name
        animal.description = params.description;
        animal.year = params.year;
        animal.image = null;
        animal.user = req.user.sub;

        animal.save( (err, animalStored) => {
            if (err) {
                res.status(500).send({message: 'error en el servidor'});
            }
            if (!animalStored) {
                res.status(404).send({message: 'no se ha guardado el animal'});
            }
            else {
                res.status(200).send({animal: animalStored});
            }
        });
    }
    else {
        res.status(404).send({message: 'el nombre es obligatorio'});
    }
}

// getAnimals
function getAnimals(req, res)
{
    Animal.find({}).populate({path: 'user'}).exec( (err, animals) => {
        if (err)
        {
            res.status(500).send({message: 'error en la peticion'});
        }
        else {
            if (!animals) {
                res.status(404).send({message: 'no hay animales'});
            }
            else {
                res.status(200).send({animals});
            }
        }
    });
}


// exports
module.exports = {
    pruebas,
    saveAnimal,
    getAnimals
};
