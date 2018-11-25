'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routes = require('./routes/user');
var animal_routes = require('./routes/animal');


// middleware the body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configurar cabeceras y CORS

// rutas base
app.use('/api', user_routes);
app.use('/api', animal_routes);

// rutas y parser
app.post('/probando', (req, res) => {
    res.status(200).send({message: 'este es el metodo probando'});
});


// exportar modulo

module.exports = app;