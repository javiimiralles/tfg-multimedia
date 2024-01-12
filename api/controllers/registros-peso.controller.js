const RegistroPeso = require('../models/registro-peso.model');
const Usuario = require('../models/usuario.model');
const { response } = require('express');
const { infoToken } = require('../utils/infotoken');

const getRegistroPesoById = async(req, res = response) => {
    const id = req.params.id;

    try {

        const registro = await RegistroPeso.findById(id);

        // KO -> regsitro no existe
        if(!registro) {
            return res.status(400).json({
                ok: false,
                msg: "No existe ningún registro de peso para el id: " + id
            });
        }

        // OK 
        res.json({
            ok: true,
            msg: 'getRegistroPesoById',
            registro
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniendo registro de peso por id'
        });
    }
}

const getRegistrosPesoByUser = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const resultados = Number(req.query.resultados) || 50;
    const fechaDesde = Date.parse(req.query.fechaDesde) || '';
    const fechaHasta = Date.parse(req.query.fechaHasta) || '';
    const idUsuario = req.params.idUsuario;

    try {

        const usuario = await Usuario.findById(idUsuario);

        // KO -> usuario no existe
        if(!usuario) {
            return res.status(400).json({
                ok:false,
                msg:"No existe ningún usuario para el id: " + idUsuario
            });
        }

        let registros, total;
        if(fechaDesde !== '' && fechaHasta !== '') {
            [registros, total] = await Promise.all([
                RegistroPeso.find({ idUsuario, fecha: { $gt:fechaDesde, $lt:fechaHasta } }).skip(desde).limit(resultados).sort({ fecha: -1 }),
                RegistroPeso.countDocuments({ idUsuario, fecha: { $gt:fechaDesde, $lt:fechaHasta } })
            ]);
        } else if(fechaDesde !== '') {
            [registros, total] = await Promise.all([
                RegistroPeso.find({ idUsuario, fecha: { $gt:fechaDesde } }).skip(desde).limit(resultados).sort({ fecha: -1 }),
                RegistroPeso.countDocuments({ idUsuario, fecha: { $gt:fechaDesde } })
            ]);
        } else if(fechaHasta !== '') {
            [registros, total] = await Promise.all([
                RegistroPeso.find({ idUsuario, fecha: { $lt:fechaHasta } }).skip(desde).limit(resultados).sort({ fecha: -1 }),
                RegistroPeso.countDocuments({ idUsuario, fecha: { $lt:fechaHasta } })
            ]);
        } else {
            [registros, total] = await Promise.all([
                RegistroPeso.find({ idUsuario }).skip(desde).limit(resultados).sort({ fecha: -1 }),
                RegistroPeso.countDocuments({ idUsuario })
            ]);
        }

        res.json({
            ok: true,
            msg: 'getRegistrosPesoByUser',
            registros,
            page: {
                desde,
                resultados,
                total,
                fechaDesde,
                fechaHasta
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniendo registros de peso por usuario'
        });
    }
}

const createRegistroPeso = async(req, res = response) => {

    const { fecha, idUsuario, ...object } = req.body;

    try {

        const usuario = await Usuario.findById(idUsuario);

        // KO -> usuario no existe
        if(!usuario) {
            return res.status(400).json({
                ok:false,
                msg:"No existe ningún usuario para el id: " + idUsuario
            });
        }

        const existeRegistro = await RegistroPeso.findOne({ fecha, idUsuario });

        // KO -> existe un registro con esa fecha para ese usuario
        if(existeRegistro) {
            return  res.status(400).json({
                ok: false,
                msg: "Ya existe un registro con esa fecha"
            });
        }

        object.fecha = fecha;
        object.idUsuario = idUsuario;
        const registro = new RegistroPeso(object);

        await registro.save();

        // OK
        res.json({
            ok:true,
            msg:"createRegistroPeso",
            registro
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error creando registro de peso'
        });
    }
}

const updateRegistroPeso = async(req, res = response) => {
    const { fecha, idUsuario, ...object } = req.body;
    const id = req.params.id;
    const token = req.header('x-token');

    try {

        const usuario = await Usuario.findById(idUsuario);

        // KO -> usuario no existe
        if(!usuario) {
            return res.status(400).json({
                ok:false,
                msg:"No existe ningún usuario para el id: " + idUsuario
            });
        }

        // KO -> se esta intentado editar un alimento de otro usuario
        if(infoToken(token).uid != idUsuario) {
            return res.status(400).json({
                ok:false,
                msg:"No se pueden editar registros de otro usuario"
            });
        }

        let existeRegistro = await RegistroPeso.findById(id);

        // KO -> no existe ningún registro de peso con ese id
        if(!existeRegistro) {
            return  res.status(400).json({
                ok: false,
                msg: "Este registro de peso no existe"
            });
        }

        existeRegistro = await RegistroPeso.findOne({ fecha, idUsuario });

        // KO -> existe un registro con esa fecha para ese usuario
        if(existeRegistro && existeRegistro._id != id) {
            return  res.status(400).json({
                ok: false,
                msg: "Ya existe un registro con esa fecha"
            });
        }

        object.fecha = fecha;
        object.idUsuario = idUsuario;

        const registro = await RegistroPeso.findByIdAndUpdate(id, object, { new: true });

        // OK
        res.json({
            ok: true,
            msg: "updateRegistroPeso",
            registro
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error editando registro de peso'
        });
    }
}

const deleteRegistroPeso = async(req, res = response) => {

    const id = req.params.id;
    const token = req.header('x-token');

    try {

        const existeRegistro = await RegistroPeso.findById(id);

        // KO -> no existe ningún registro de peso con ese id
        if(!existeRegistro) {
            return  res.status(400).json({
                ok:false,
                msg:"No existe ningún registro de peso con ese id: " + id
            });
        }

        // KO -> se esta intentado eliminar un registro de otro usuario
        if(infoToken(token).uid != existeRegistro.idUsuario) {
            return res.status(400).json({
                ok: false,
                msg: "No se pueden eliminar registros de peso de otro usuario"
            });
        }

        const registroEliminado = await RegistroPeso.findByIdAndDelete(id);

        res.json({
            ok:true,
            msg:"deleteRegistroPeso",
            registroEliminado
        })

    } catch(error){
        console.log(error);
        return res.json({
            ok: false,
            msg: 'Error borrando registro de peso'
        })
    }
}

module.exports = {
    getRegistroPesoById,
    getRegistrosPesoByUser,
    createRegistroPeso,
    updateRegistroPeso,
    deleteRegistroPeso
}
