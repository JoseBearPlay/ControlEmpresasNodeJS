'use strict'

var express = require("express");
var empresa_controlador = require("../controladores/empresa.controlador");

var md_authorization = require("../middlewares/authenticated");

var api = express.Router();
api.get('/ejemploEmpresas', empresa_controlador.ejemploEmpresa);

module.exports = api;