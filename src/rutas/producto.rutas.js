'use strict'

var express = require("express");
var producto_controlador = require("../controladores/producto.controlador");

var md_authorization = require("../middlewares/authenticated");

var api = express.Router();
api.get('/ejemploProducto', producto_controlador.ejemploProducto);
api.post('/agregarProducto', md_authorization.ensureAuth, producto_controlador.agregarProducto);
api.get('/ordenarProductosAscendente', md_authorization.ensureAuth, producto_controlador.ordenarProductosAscendente);
api.get('/ordenarProductosDescendente', md_authorization.ensureAuth, producto_controlador.ordenarProductosDescendente);

module.exports = api;