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
        productoModel.vendido = 0;
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


function obtenerProductos(req, res){

    var params = req.body;

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede ver los productos agregados a la empresa'});
    }

    if(params.nombre === req.user.nombre){

        Producto.find({ 

            productoEmpresa: req.user.nombre
        
        }).exec((err, productosReconocidos)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

            if(!productosReconocidos) return res.status(500).send({mensaje: 'No se han podido obtener los productos o no posee productos registrados'})
    
            return res.status(200).send({ productosReconocidos });
        })
    } else{
        return res.status(500).send({ mensaje: 'Solo puedes ver los productos de tu propia empresa'});
    }
}


function obtenerProductoNombre(req, res){

    var params = req.body;

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede buscar productos en la empresa'});
    }

    Producto.findOne({ 

        nombre: params.nombre

    }).exec((err, productoReconocido)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

        if(!productoReconocido) return res.status(500).send({mensaje: 'No existe el nombre del producto'});

        if(productoReconocido.productoEmpresa != req.user.nombre) return res.status(500).send({mensaje: 'El producto no existe en la empresa'});

        return res.status(200).send({ productoReconocido})
    })
}

function obtenerProductoProveedor(req, res){

    var params = req.body;

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede buscar productos en la empresa'});
    }

    Producto.findOne({ 

        proveedor: params.proveedor

    }).exec((err, productoReconocido)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

        if(!productoReconocido) return res.status(500).send({mensaje: 'No existe el proveedor del producto'});

        if(productoReconocido.productoEmpresa != req.user.nombre) return res.status(500).send({mensaje: 'El proveedor no existe en la empresa'});

        return res.status(200).send({ productoReconocido})
    })
}


module.exports = {
    ejemploProducto,
    agregarProducto,
    ordenarProductosAscendente,
    ordenarProductosDescendente,
    obtenerProductos,
    obtenerProductoNombre,
    obtenerProductoProveedor
}