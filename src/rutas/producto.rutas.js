'use strict'

var express = require("express");
var producto_controlador = require("../controladores/producto.controlador");

var md_authorization = require("../middlewares/authenticated");

var api = express.Router();
api.get('/ejemploProducto', producto_controlador.ejemploProducto);
api.post('/agregarProducto', md_authorization.ensureAuth, producto_controlador.agregarProducto);

module.exports = api;