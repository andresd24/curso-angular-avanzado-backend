'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');

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

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser
};