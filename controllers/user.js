'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');

//modelos
var User = require('../models/user');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando controlador de usuarios y la accion de pruebas'
    });

} // end pruebas


// saveUser
function saveUser(req, res) {
    var user = new User();
    var params = req.body;

    console.log(params);

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
                        res.status(200).send({user}); 
                        res.end();       
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


module.exports = {
    pruebas,
    saveUser,
    login
};