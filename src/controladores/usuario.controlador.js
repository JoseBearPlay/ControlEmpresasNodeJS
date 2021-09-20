'use strict'

var Usuario = require("../modelos/usuario.modelo");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");
var pdf = require('pdfkit');
var fs = require('fs');

var Informacion;

function ejemplo(req, res){
    res.status(200).send({mensaje: 'El usuario se creo correctamente'});
}

function Admin(req, res){
    var usuarioModel = new Usuario();

    usuarioModel.usuario = 'Admin';
    usuarioModel.password = '123456';
    usuarioModel.rol = 'Admin';

    Usuario.findOne({usuario: usuarioModel.usuario}, (err, administradorFundado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(administradorFundado){
            return console.log('Error el usuario admin ya existe');
        } else{
            bcrypt.hash(usuarioModel.password, null, null, (err, passwordEncriptada)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

                if(passwordEncriptada){
                    usuarioModel.password = passwordEncriptada;
                    usuarioModel.usuario = usuarioModel.usuario;
                    usuarioModel.rol = 'Admin'

                    usuarioModel.save((err, adminGuardado)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion de crear el administrador'});
                        if(adminGuardado){
                            return console.log('Se han guardado los datos del administrador correctamente');
                        } else{
                            return res.status(500).send({mensaje: 'No se a podido crear al usuario admin correctamente'});
                        }

                    })
                } else{
                    return res.status(500).send({mensaje: 'No se han podido decoficar los datos de la contraseña'});
                }
            })
        }
    })
}

module.exports = {
    ejemplo,
    Admin
}