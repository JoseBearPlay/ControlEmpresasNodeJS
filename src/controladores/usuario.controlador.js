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


function loginAdmin(req, res) {
    var params = req.body;
   
    Usuario.findOne({ usuario: params.usuario }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

        if (usuarioEncontrado) {
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passVerificada) => {
                if (passVerificada) {
                    if (params.getToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(usuarioEncontrado)
                        })
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuarioEncontrado });
                    }
                } else {
                    return res.status(500).send({ mensaje: 'El usuario no se a podido identificar' });
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'Error al buscar el usuario' });
        }
    })
}


function agregraEmpleado(req, res){
    
    var empleadoModel = new Usuario();
    var params = req.body;

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol de tipo empresa puede crear usuarios'});
    }

    if(params.nombre && params.puesto && params.departamento){
        
        empleadoModel.nombre = params.nombre;
        empleadoModel.rol = 'empleado',
        empleadoModel.puesto = params.puesto;
        empleadoModel.departamento = params.departamento;
        empleadoModel.empleadoEmpresa = req.user.nombre;


        Usuario.find({ 
            $or: [
                { nombre: empleadoModel.nombre},    
            ]
        }).exec((err, empleadoEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de crear el Empleado'});

            if(empleadoEncontrado && empleadoEncontrado.length >= 1){
                return res.status(500).send({mensaje: 'El empleado ya se encuentra creado dentro del sistema'});
            } else{
                
                empleadoModel.save((err, empleadoGuardado)=>{
                    if(err) return res.status(500).send({mensaje: 'Error en la peticion de guardar el empleado'});

                    if(empleadoGuardado){
                        res.status(200).send({ empleadoGuardado })
                    } else{
                        return res.status(404).send({ mensaje: 'No se ha podido registrar al empleado'});
                    }
                })
            }
        })
    }
}

module.exports = {
    ejemplo,
    Admin,
    loginAdmin,
    agregraEmpleado

}
