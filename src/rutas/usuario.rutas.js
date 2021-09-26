'use strict'

var express = require("express");
var usuario_controlador = require("../controladores/usuario.controlador");

var md_authorization = require("../middlewares/authenticated");

var api = express.Router();
api.get('/ejemploEmpleados', usuario_controlador.ejemplo);
api.get('/usuarioAdmin', usuario_controlador.usuarioAdmin);
api.post('/loginAdmin', usuario_controlador.loginAdmin);
api.post('/agregraEmpleado', md_authorization.ensureAuth, usuario_controlador.agregraEmpleado);
api.put('/editarEmpleado/:id', md_authorization.ensureAuth, usuario_controlador.editarEmpleado);
api.delete('/eliminarEmpleado/:id', md_authorization.ensureAuth, usuario_controlador.eliminarEmpleado);
api.get('/obtenerEmpleadoID/:id', md_authorization.ensureAuth, usuario_controlador.obtenerEmpleadoID);
api.get('/obtenerEmpleadoNombre', md_authorization.ensureAuth, usuario_controlador.obtenerEmpleadoNombre)
api.get('/obtenerEmpleadoPuesto', md_authorization.ensureAuth, usuario_controlador.obtenerEmpleadoPuesto);
api.get('/obtenerEmpleadoDepartamento', md_authorization.ensureAuth, usuario_controlador.obtenerEmpleadoDepartamento);
api.get('/obtenerEmpleados', md_authorization.ensureAuth, usuario_controlador.obtenerEmpleados);
api.get('/generarPDF', md_authorization.ensureAuth, usuario_controlador.generarPDF);

module.exports = api;