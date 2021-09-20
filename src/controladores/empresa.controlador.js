'use stric'

var Empresa = require("../modelos/empresa.modelo");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../servicios/jwt");


function ejemploEmpresa(req, res){
    return res.status(200).send({mensaje: 'Hola desde el controlador de Empresas'});
}



module.exports = {
    ejemploEmpresa
}
