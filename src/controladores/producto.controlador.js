'use strict'

const productoModelo = require("../modelos/producto.modelo");
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

    if(req.user.rol != 'empresa'){
        return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede ver los productos agregados a la empresa'});
    }
    
    Producto.find().exec((err, productos)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener los productos'});
        if(!productos) return res.status(500).send({mensaje: 'Error al obtener los productos o no posee productos registrados en la empresa'});

        return res.status(200).send({productos});

    })
}

function obtenerProductosID(req, res){

  var productoId = req.params.idProducto;

  if(req.user.rol != 'empresa'){
    return res.status(500).send({mensaje: 'Solo el rol tipo empresa puede ver los productos agregados a la empresa'});
  }

  Producto.findById(productoId, (err, productoEncontrado)=>{
    if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
    
    if(!productoEncontrado) return res.status(500).send({mensaje: 'Error al obtener el producto'});

    return res.status(200).send({ productoEncontrado });
  })
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



function vender(req, res){
    var idProducto = req.params.id;
    var params = req.body;

    Producto.findById(idProducto,{vendido:1},(err, productoEncontrado)=>{
        if(err){
            res.status(200).send({mensaje: 'Error en la peticion'});
        } else if(productoEncontrado){
            console.log(productoEncontrado)

            var suma = Number(productoEncontrado.vendido) + Number(params.vendido);

            var vendido = {vendido: suma};

            Producto.findByIdAndUpdate(idProducto,vendido,{new: true},(err, productoVendido)=>{
                if(err){ 
                    return res.status(500).send({mensaje: 'Error en la peticion'});
                } else if(productoVendido){
                    res.send({productoSaliente: productoVendido});
                } else{
                    res.status(500).send({mensaje: 'No se pudo vender el producto'});
                }
                })
        } else{
            return res.status(500).send({ mensaje: 'No se encontro el producto a vender'});
        }
    })
}


module.exports = {
    ejemploProducto,
    agregarProducto,
    ordenarProductosAscendente,
    ordenarProductosDescendente,
    obtenerProductos,
    obtenerProductosID,
    obtenerProductoNombre,
    obtenerProductoProveedor,
    vender
}