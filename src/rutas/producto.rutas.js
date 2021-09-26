'use strict'

var express = require("express");
var producto_controlador = require("../controladores/producto.controlador");

var md_authorization = require("../middlewares/authenticated");

var api = express.Router();
api.get('/ejemploProducto', producto_controlador.ejemploProducto);
api.post('/agregarProducto', md_authorization.ensureAuth, producto_controlador.agregarProducto);
api.get('/ordenarProductosAscendente', md_authorization.ensureAuth, producto_controlador.ordenarProductosAscendente);
api.get('/ordenarProductosDescendente', md_authorization.ensureAuth, producto_controlador.ordenarProductosDescendente);
api.get('/obtenerProductos', md_authorization.ensureAuth, producto_controlador.obtenerProductos);
api.get('/obtenerProductosID/:idProducto', md_authorization.ensureAuth, producto_controlador.obtenerProductosID);
api.get('/obtenerProductoNombre', md_authorization.ensureAuth, producto_controlador.obtenerProductoNombre);
api.get('/obtenerProductoProveedor', md_authorization.ensureAuth, producto_controlador.obtenerProductoProveedor);
api.put('/vender/:id', producto_controlador.vender);

module.exports = api;