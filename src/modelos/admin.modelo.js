'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AdminSchema = Schema({

    usuario: String,
    password: String,
    rol: String,
})

module.exports = mongoose.model('admin', AdminSchema);