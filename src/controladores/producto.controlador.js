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


function ordenarProductosAscendente(req, res){

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede ver los productos de la empresa'});
    }

    Producto.find().sort({stock:1}).exec((err, productos)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!productos) return res.status(500).send({mensaje: 'Error al obtener los productos o no posee productos registrados en la empresa'});

        return res.status(200).send({ productos });
    })
}


function ordenarProductosDescendente(req, res){

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede ver los productos de la empresa'});
    }

    Producto.find().sort({stock:-1}).exec((err, productos)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!productos) return res.status(500).send({mensaje: 'Error al obtenet los productos o no posee productos registrados en la empresa'});

        return res.status(200).send({productos});
    })
}


module.exports = {
    ejemploProducto,
    agregarProducto,
    ordenarProductosAscendente,
    ordenarProductosDescendente
}