'use stric'

var Empresa = require("../modelos/empresa.modelo");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../servicios/jwt");


function ejemploEmpresa(req, res){
    return res.status(200).send({mensaje: 'Hola desde el controlador de Empresas'});
}


function loginEmpresa(req, res) {
    var params = req.body;
   
    Empresa.findOne({ nombre: params.nombre }, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

        if (empresaEncontrada) {
            bcrypt.compare(params.password, empresaEncontrada.password, (err, passVerificada) => {
                if (passVerificada) {
                    if (params.getToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(empresaEncontrada)
                        })
                    } else {
                        empresaEncontrada.password = undefined;
                        return res.status(200).send({ empresaEncontrada });
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

function agregarEmpresa(req, res){
    
    var empresaModel = new Empresa();
    var params = req.body;

    if(req.user.rol != 'Admin'){
        return res.status(500).send({mensaje: 'Solo el rol de tipo empresa puede crear Empresas'});
    }

    if(params.nombre && params.password){
        empresaModel.nombre = params.nombre;
        empresaModel.direccion = params.direccion;
        empresaModel.telefono = params.telefono;
        empresaModel.password = params.password;
        empresaModel.rol = 'empresa';


        Empresa.find({
            $or: [
                { nombre: empresaModel.nombre},
            ]
        }).exec((err, empresaEncontrada)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de crear la empresa'});
            
            if(empresaEncontrada && empresaEncontrada.length >= 1){
                return res.status(500).send({mensaje: 'La empresa que ingreso ya fue registrada con anterioridad'});
            } else {
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
                    empresaModel.password = passwordEncriptada;

                    empresaModel.save((err, empresaGuardada)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion de guardar la empresa'});

                        if(empresaGuardada) {
                            res.status(200).send({ empresaGuardada })
                        } else {
                            res.status(404).send({mensaje: 'No se ha podido registrar la empresa'});
                        }
                    })
                })
            }
        })
    }
}


function obtenerEmpresas(req, res){

    if(req.user.rol != 'Admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo Admin puede ver las empresas registradas en el sistema'});
    }

    Empresa.find().exec((err, empresas)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener las empresas'});
        if(!empresas) return res.status(500).send({mensaje: 'Error al obtener las empresas o no posee empresas registradas en el sistema'});

        return res.status(200).send({empresas});
    })
}


function obtenerEmpresaID(req, res){

    var empresaId = req.params.idEmpresa;

    if(req.user.rol != 'Admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo Admin puede ver las empresas registradas en el sistema'});
    }

    Empresa.findById(empresaId, (err, empresaEncontrada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de empresa'});
        if(!empresaEncontrada) return res.status(500).send({mensaje: 'Error al obtener la empresa'});

        return res.status(200).send({ empresaEncontrada });
    })
}


function editarEmpresa(req, res){
    
    var idEmpresa = req.params.id;
    var params = req.body;

    delete params.password;

    if(req.user.rol != 'Admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo Admin puede editar las empresas registradas en el sistema'});
    }
    
    Empresa.findByIdAndUpdate(idEmpresa, params, {new: true}, (err, empresaActualizada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de actualizar la empresa'});
        if(!empresaActualizada) return res.status(500).send({mensaje: 'No se ha podido actualizar los datos de la empresa'});

        return res.status(200).send({ empresaActualizada });
    })
}


function eliminarEmpresa(req, res){
    
    var idEmpresa = req.params.id

    if(req.user.rol != 'Admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo Admin puede ver las empresas registradas en el sistema'});
    }

    Empresa.findByIdAndDelete(idEmpresa, ((err, empresaEliminada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de eliminar a la empresa'});
        if(!empresaEliminada) return res.status(500).send({mensaje: 'No se ha podido eliminar a la empresa del sistema'});

        return res.status(200).send({ empresaEliminada });
    }))
}

module.exports = {
    ejemploEmpresa,
    loginEmpresa,
    agregarEmpresa,
    obtenerEmpresas,
    obtenerEmpresaID,
    editarEmpresa,
    eliminarEmpresa
}
