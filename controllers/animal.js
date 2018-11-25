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

// getAnimal
function getAnimal(req, res) {
    var animalId = req.params.id;

    Animal.findById(animalId).populate({path: 'user'}).exec((err, animal) =>{
        if (err)
        {
            res.status(500).send({message: 'error en la peticion'});
        }
        else {
            if (!animal) {
                res.status(404).send({message: 'el animal no existe'});
            }
            else {
                res.status(200).send({animal});
            }
        }
    });
}

// updateAnimal
function updateAnimal(req, res) {
    var animalId = req.params.id;
    var update = req.body;
    
    Animal.findByIdAndUpdate(animalId, update, {new: true}, (err, animalUpdated) => {
        if (err) {
            res.status(500).send({message: 'error en la peticion'});
        }
        else
        {
            if (!animalUpdated) {
                res.status(404).send({message: 'no se ha actualizado el animal'});
            }
            else {
                res.status(200).send({animal: animalUpdated});
            }
        }
    });
}


// updloadImage
function updloadImage(req, res) {
    var animalId = req.params.id;
    var file_name = "No subido...";

    var file_path;
    var file_split;
    var file_name;

    if (req.files)
    {
        file_path = req.files.image.path;
        file_split = file_path.split('/');
        file_name = file_split[2];
    }


    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
        
        Animal.findByIdAndUpdate(animalId, {image: file_name}, {new: true}, (err, animalUpdated) => {
            if (err) {
                res.status(500).send({message: 'error actualizando usuario'});
            }
            else {
                if (!animalUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar el animal'});
                }
                else 
                {
                    res.status(200).send({animal: animalUpdated, image: file_name});
                }
            }
        });
    }
    else {
        fs.unlink(file_path, (err) => {
            if (err) {
                return res.status(500).send( {
                    message: 'extension no valida y fichero no guardado ', 
                    file_ext: file_ext,
                    file_path: file_path
                });
            }
            else {
                return res.status(500).send( {
                    message: 'extension no valida', 
                    file_ext: file_ext,
                    file_path: file_path
                });
            }
        })

    }
}   // end uploadImage

// getImageFile
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/animals/' + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));    
        }
        else {
            res.status(404).send({message: 'la imagen no fue encontrada'});
        }
    });    
}   // end getImageFile

// deleteAnimal
function deleteAnimal(req, res) {
    var animalId = req.params.id;

    Animal.findByIdAndRemove(animalId, (err, animalRemoved) => {
        if (err) {
            res.status(500).send({message: 'error en la peticion'});
        }
        else {
            if (!animalRemoved) {
                res.status(404).send({message: 'no se pudo borrar animal'});
            }
            else {
                res.status(200).send({animal: animalRemoved});
            }
        }
    });
}

// exports
module.exports = {
    pruebas,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal,
    updloadImage,
    getImageFile,
    deleteAnimal
};
