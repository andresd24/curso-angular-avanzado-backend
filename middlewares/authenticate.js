'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var express = require('express');

var app = express();
var secret = 'clave_secreta_del_curso_de_angular_4_avanzado';

exports.ensureAuth = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(403).send({message: 'la peticion no tiene la cabezera de autenticacion'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'el token ha expirado'
            });        

        }
    }
    catch (ex)
    {
        return res.status(404).send({
            message: 'el token no es valido'
        });
    }

    req.user = payload;

    next();
};
