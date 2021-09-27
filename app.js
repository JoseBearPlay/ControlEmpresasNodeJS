'use strict'

//Variables Globales
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");

//Importacion de Rutas
var usuario_rutas = require("./src/rutas/usuario.rutas");
var empresa_rutas = require("./src/rutas/empresa.rutas");
var producto_rutas = require("./src/rutas/productos.rutas");

//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Cabeceras
app.use(cors());

//Aplcacion de rutas
app.use('/api', usuario_rutas, empresa_rutas, producto_rutas);

//Exportar
module.exports = app;

