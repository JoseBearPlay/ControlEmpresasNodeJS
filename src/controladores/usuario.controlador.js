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
        empleadoModel.trabajadorEmpresa = req.user.nombre;


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


function editarEmpleado(req, res){

    var idEmpleado = req.params.id;
    var params = req.body;

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol de tipo empresa puede editar los usuarios'});
    }
    
    Usuario.find({

        nombre:params.nombre
    
    }).exec((err, empleadoCoincidente)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de empleado'});
        
        if(empleadoCoincidente && empleadoCoincidente.length >= 1){
            return res.status(500).send({mensaje: 'Los datos ingresados ya le pertenecen a otro empleado'});
        } else{

            Usuario.findOne({

                 _id: idEmpleado 
                
            }).exec((err, empleadoCoincidente)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
               
                if(!empleadoCoincidente) return res.status(500).send({mensaje: 'Error al editar el usuario seleccionado'});

                if(empleadoCoincidente.trabajadorEmpresa != req.user.nombre) return res.status(500).send({mensaje: 'Solo puedes editar los empleados de tu propia empresa'});
 
                Usuario.findByIdAndUpdate(idEmpleado, params, {new: true}, (err, empleadoEditado)=>{
                    if(err) return res.status(500).send({mensaje: 'Error en la peticion de editar'});
                    if(!empleadoEditado) return res.status(500).send({mensaje: 'No se a podido editar al Empleado'});

                    return res.status(200).send({ empleadoEditado });
                })
            })
        }
    })
}


function eliminarEmpleado(req, res){
    
    var idEmpleado = req.params.id;
    var params = req.body;

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol de tipo empresa puede eliminar empleados'});
    }

    Usuario.findOne({ 

        _id: idEmpleado

    }).exec((err, empleadoCoincidente)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
    
        if(!empleadoCoincidente) return res.status(500).send({mensaje: 'Error al eliminar el usuario seleccionado'});

        if(empleadoCoincidente.trabajadorEmpresa != req.user.nombre) return res.status(500).send({mensaje: 'Solo puedes eliminar los empleados de tu propia empresa'})
   
        Usuario.findOneAndDelete(idEmpleado, (err, empleadoEliminado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!empleadoEliminado) return res.status(500).send({mensaje: 'No se a podido eliminar al empleado'});

            return res.status(200).send({ empleadoEliminado });
        })
    })
}


function obtenerEmpleadoID(req, res){

    var empleadoId = req.params.id;

    if(req.user.rol != 'empresa') {
        return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede ver empleados'});
    }

   Usuario.findById(empleadoId, (err, empleadoEncontrado)=>{
       if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

       if(!empleadoEncontrado) return res.status(500).send({mensaje: 'No se ha podido obtener el empleado de la empresa'});

       return res.status(200).send({ empleadoEncontrado });
   })
}


function obtenerEmpleadoNombre(req, res){

    var params = req.body;

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede buscar empleados por nombre'});
    }

    Usuario.findOne({ 

        nombre: params.nombre

    }).exec((err, empleadoReconocido)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

        if(!empleadoReconocido) return res.status(500).send({mensaje: 'No existe el nombre del usuario buscado'});

        if(empleadoReconocido.trabajadorEmpresa != req.user.nombre) return res.status(500).send({mensaje: 'El empleado no existe en la empresa'});

        return res.status(200).send({ empleadoReconocido });
    })
}


function obtenerEmpleadoPuesto(req, res){

    var params = req.body;

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede buscar empleadors por puesto'});
    }

    Usuario.find({ 

        $or:[
            { puesto: params.puesto, trabajadorEmpresa: req.user.nombre}
        ]

    }).exec((err, empleadoReconocido)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

        if(!empleadoReconocido) return res.status(500).send({mensaje: 'No existe el puesto dentro de la empresa'});

        return res.status(200).send({ empleadoReconocido });
    })
}


function obtenerEmpleadoDepartamento(req, res){

    var params = req.body;

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede buscar empleaos por departamento'});
    }

    Usuario.find({ 

        $or:[
            { departamento: params.departamento, trabajadorEmpresa: req.user.nombre}
        ]

    }).exec((err, empleadoReconocido)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

        if(!empleadoReconocido) return res.status(500).send({mensaje: 'No existe el puesto dentro de la empresa'});
    
        return res.status(200).send({ empleadoReconocido });
    })
}


function obtenerEmpleados(req, res){
    
    var params = req.body;

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede buscar empleados'});
    }

    Usuario.find().exec((err, empleados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

        if(!empleados)  return res.status(500).send({mensaje: 'Error al obtener los empleados o no posee empleados en la empresa'});

        return res.status(200).send({ empleados})
    })

    /*
    if(params.nombre === req.user.nombre){

        Usuario.find({
            
            trabajadorEmpresa: req.user.nombre
        
        }).exec((err, empleadosReconocidos)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

            if(!empleadosReconocidos) return res.status(500).send({mensaje: 'No se han podido obtener los usuarios o no posee usuarios registrados'});

            return res.status(200).send({ empleadosReconocidos });
        })

    } else{
        return res.status(500).send({ mensaje: 'Solo puedes ver empleados de tu propia empresa'});
    }
    */
}


function generarPDF(req, res){

    var params = req.body;

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede generar PDF'});
    }

    if(params.nombre === req.user.nombre){

        Usuario.find({

            trabajadorEmpresa: req.user.nombre

        }).exec((err, empleadoReconocido)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

            if(!empleadoReconocido) return res.status(500).send({mensaje: 'No existen empleados para generar PDF'});

            Informacion = empleadoReconocido

            var doc = new pdf();

            doc.pipe(fs.createWriteStream(`${req.user.nombre}.pdf`));

            doc.text(`Empleados ${req.user.nombre}`,{
                align: 'center'
            })

            doc.text(Informacion,{
                align: 'left'
            })

            doc.end()
        })

        return res.status(200).send({mensaje:'PDF generado!'});

    } else{
        return res.status(500).send({ mensaje: 'Solo puedes generar PDF de tu propia empresa'});
    }


}


module.exports = {
    ejemplo,
    Admin,
    loginAdmin,
    agregraEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    obtenerEmpleadoID,
    obtenerEmpleadoNombre,
    obtenerEmpleadoPuesto,
    obtenerEmpleadoDepartamento,
    obtenerEmpleados,
    generarPDF
}