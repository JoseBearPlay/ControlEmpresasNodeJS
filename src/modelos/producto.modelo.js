'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProdcutosSchema = Schema({
    nombre: String,
    proveedor: String,
    stock: Number,
    vendido: Number,
    productoEmpresa: {type:Schema.Types.String, ref:'empresa'} 
})

module.exports = mongoose.model('producto', ProdcutosSchema)