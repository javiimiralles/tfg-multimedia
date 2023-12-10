const Alimento = require('../models/alimento.model');
const { response } = require('express');
const { infoToken } = require('../utils/infotoken');

const getAlimentos = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const resultados = Number(req.query.resultados) || Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;

    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }

    const id = req.query.id;

    try {

        let alimentos, total;
        if(id) {
            [alimentos, total] = await Promise.all([
                Alimento.findByIf(id),
                Alimento.countDocuments()
            ]);
        } else {
            if(texto) {
                [alimentos, total] = await Promise.all([
                    Alimento.find({ nombre: textoBusqueda }).skip(desde).limit(resultados),
                    Alimento.countDocuments({ nombre: textoBusqueda })
                ]);
            } else {
                [alimentos, total] = await Promise.all([
                    Alimento.find({}).skip(desde).limit(resultados),
                    Alimento.countDocuments()
                ]);
            }
        }

        res.json({
            ok: true,
            msg: 'getAlimentos',
            alimentos,
            page: {
                desde,
                resultados,
                total
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniedo alimentos'
        });
    }
}

const createAlimento = async(req, res = response) => {

    const { nombre, idUsuario, ...object } = req.body;
    
    try {

        const existeAlimento = await Alimento.findOne({ nombre, idUsuario });

        // KO -> existe un alimento con ese nombre para ese usuario
        if(existeAlimento) {
            return  res.status(400).json({
                ok:false,
                msg:"Ya existe un alimento con ese nombre"
            });
        }

        object.nombre = nombre;
        object.idUsuario = idUsuario;
        const alimento = new Alimento(object);

        await alimento.save();

        // OK
        res.json({
            ok:true,
            msg:"createAlimento",
            alimento
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error creando alimento'
        });
    }
}

const updateAlimento = async(req, res = response) => {

    const { nombre, idUsuario, ...object } = req.body;
    const id = req.params.id;
    const token = req.header('x-token');

    try {

        // KO -> se esta intentado editar un alimento de otro usuario
        if(infoToken(token).uid != idUsuario) {
            return res.status(400).json({
                ok:false,
                msg:"No se pueden editar alimentos de otro usuario"
            });
        }

        const existeAlimento = await Alimento.findOne({ nombre, idUsuario });

        // KO -> existe un alimento con ese nombre para ese usuario
        if(existeAlimento && existeAlimento._id != id) {
            return res.status(400).json({
                ok:false,
                msg:"Ya existe un alimento con ese nombre"
            });
        }

        object.nombre = nombre;
        object.idUsuario = idUsuario;
        
        const alimento = await Alimento.findByIdAndUpdate(id, object, { new: true });

        // OK
        res.json({
            ok:true,
            msg:"updateAlimento",
            alimento
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error editando alimento'
        });
    }
}

const deleteAlimento = async(req, res = response) => {
    
    const id = req.params.id;
    const token = req.header('x-token');

    try {

        // KO -> se esta intentado eliminar un alimento de otro usuario
        if(infoToken(token).uid != idUsuario) {
            return res.status(400).json({
                ok:false,
                msg:"No se pueden eliminar alimentos de otro usuario"
            });
        }

        const existeAlimento = await Alimento.findOne({ nombre, idUsuario });

        // KO -> no existe un alimento con ese nombre para ese usuario
        if(!existeAlimento) {
            return  res.status(400).json({
                ok:false,
                msg:"No existe ningún alimento con ese nombre"
            });
        }

        const alimentoEliminado = await Alimento.findByIdAndDelete(id);

        res.json({
            ok:true,
            msg:"deleteAlimento",
            alimentoEliminado
        })

    } catch(error){
        console.log(error);
        return  res.json({
            ok:false,
            msg:'Error borrando alimento'
        })
    }
}