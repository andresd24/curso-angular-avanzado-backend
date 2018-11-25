'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');

//modelos
var User = require('../models/user');

var jwt = require('../services/jwt');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando controlador de usuarios y la accion de pruebas',
        user: req.user
    });

} // end pruebas


// saveUser
function saveUser(req, res) {
    var user = new User();
    var params = req.body;

    if (params.name && params.surname && params.email && params.password)
    {
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = params.image;

        User.findOne({email: user.email.toLowerCase()}, (err, isSetUser) => {
            if (err) {
                res.status(500).send({message: "error al crear usuario"})
            }
            else
            {
                if (!isSetUser)
                {
                    bcrypt.hash(params.password, null, null, function(err, hash) {
                        user.password = hash;
                        user.save((err, userStored) => {
                            if (err)
                            {
                                res.status(500).send({message: 'error al guardar'});
                            }    
                            else {
                                if (!userStored){
                                    res.status(404).send({message: 'No se ha registrado user'});
                                }       
                                else {
                                    res.status(200).send({user: userStored});
                                    console.log(userStored);
                                }
                            }
            
                        });
                    });
                }
                else 
                {
                    res.status(404).send({message: 'usuario no puede registrarse'});
                }
            }
        });
    }
    else 
    {
        res.status(200).send({
            message: 'Introduce los datos correctos'
        });
    }
}  // end saveUser

// login
function login(req, res)
{
    var params = req.body;
    var email = params.email;
    var password = params.password;


    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if (err) {
            res.status(500).send({message: "error al crear usuario"})
        }
        else
        {
            if (user)
            {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        if (params.gettoken) {
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }
                        else
                        {
                            res.status(200).send({user}); 
                            res.end();
                        }       
                    }   
                    else {
                        res.status(404).send({message: "el usuario no ha podido loguearse correctamente"});        
                    }     
                });
            }
            else {
                res.status(404).send({message: "el usuario no ha podido loguearse"});        
            }
        }
    });        

}   // end login


//update user
function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
    
    if (userId != req.user.sub) {
        return res.status(500).send({message: 'no tienes permiso para actualizar usuario'});
    }

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
        if (err) {
            res.status(500).send({message: 'error actualizando usuario'});
        }
        else {
            if (!userUpdated) {
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            }
            else 
            {
                res.status(200).send({user: userUpdated});
            }
        }
    });
}   // end update user

// updloadImage
function updloadImage(req, res) {
    var userId = req.params.id;
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
        if (userId != req.user.sub) {
            return res.status(500).send({ message: 'no tienes permiso para actulizar el usuario'});
        }
        
        User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {
            if (err) {
                res.status(500).send({message: 'error actualizando usuario'});
            }
            else {
                if (!userUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                }
                else 
                {
                    res.status(200).send({user: userUpdated, image: file_name});
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



 

}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    updloadImage
};