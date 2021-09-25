'use strict'

var Producto = require("../modelos/producto.modelo");

function ejemploProducto(req, res){
    return res.status(200).send({mensaje: 'Hola desde el controlador de Productos'});
}

function agregarProducto(req, res){

    var productoModel = new Producto();
    var params = req.body;

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol de tipo empresa puede crear productos'});
    }

    if(params.nombre && params.proveedor){
        productoModel.nombre = params.nombre;
        productoModel.proveedor = params.proveedor;
        productoModel.stock = params.stock;
        productoModel.vendido = params.vendido;
        productoModel.productoEmpresa = req.user.nombre


        Producto.find({
            $or: [
                { nombre: productoModel.nombre}
            ]
        }).exec((err, productoEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

            if(productoEncontrado && productoEncontrado.length >= 1){
                return res.status(500).send({mensaje: 'El producto que desea crear ya existe dentro de la base de datos'});
            } else{

                productoModel.save((err, productoGuardado)=>{
                    if(err) return res.status(500).send({mensaje: 'Error en la peticion de guardar el producto'});

                    if(productoGuardado){
                        res.status(200).send({ productoGuardado })
                    } else{
                        res.status(404).send({ mensaje: 'No se ha podido registrar el producto'});
                    }
                })
            }
        })
    }
}

module.exports = {
    ejemploProducto,
    agregarProducto
}