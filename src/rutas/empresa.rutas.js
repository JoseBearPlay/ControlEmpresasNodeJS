'use strict'

var express = require("express");
var empresa_controlador = require("../controladores/empresa.controlador");

var md_authorization = require("../middlewares/authenticated");

var api = express.Router();
api.get('/ejemploEmpresas', empresa_controlador.ejemploEmpresa);
api.post('/loginEmpresa', empresa_controlador.loginEmpresa);
api.post('/agregarEmpresa', md_authorization.ensureAuth, empresa_controlador.agregarEmpresa);
api.get('/obtenerEmpresas', md_authorization.ensureAuth, empresa_controlador.obtenerEmpresas);
api.get('/obtenerEmpresaID/:idEmpresa', md_authorization.ensureAuth, empresa_controlador.obtenerEmpresaID);
api.put('/editarEmpresa/:id', md_authorization.ensureAuth, empresa_controlador.editarEmpresa);
api.delete('/eliminarEmpresa/:id', md_authorization.ensureAuth, empresa_controlador.eliminarEmpresa);

module.exports = api;