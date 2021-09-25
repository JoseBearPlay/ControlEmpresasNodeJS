'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({

    nombre: String,
    usuario: String,
    password: String,
    rol: String,
    puesto: String,
    departamento: String,
    trabajadorEmpresa:{type:Schema.Types.String, ref:'empresa'}
})

module.exports = mongoose.model('usuario', UsuarioSchema);