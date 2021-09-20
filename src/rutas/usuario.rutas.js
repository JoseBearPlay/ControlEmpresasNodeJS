'use strict'

var express = require("express");
var usuario_controlador = require("../controladores/usuario.controlador");

var md_authorization = require("../middlewares/authenticated");

var api = express.Router();
api.get('/ejemploEmpleados', usuario_controlador.ejemplo);
api.get('/admin', usuario_controlador.Admin);

module.exports = api;