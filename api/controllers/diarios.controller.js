const Diario = require('../models/diario.model');
const Usuario = require('../models/usuario.model');
const Alimento = require('../models/alimento.model');
const { response } = require('express');
const { infoToken } = require('../utils/infotoken');

const getDiarioById = async(req, res = response) => {
    const id = req.params.id;

    try {

        const diario = await Diario.findById(id);

        // KO -> diario no existe
        if(!diario) {
            return res.status(400).json({
                ok: false,
                msg: "No existe ningún diario para el id: " + id
            });
        }

        // OK 
        res.json({
            ok: true,
            msg: 'getDiarioById',
            diario
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniendo diario por id'
        });
    }
}

const getDiariosByUser = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const resultados = Number(req.query.resultados) || Number(process.env.DOCSPERPAGE);
    const fechaDesde = Date.parse(req.query.fechaDesde) || '';
    const fechaHasta = Date.parse(req.query.fechaHasta) || '';
    const fechaExacta = Date.parse(req.query.fechaExacta) || '';
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

        let diarios, total;
        if(fechaExacta !== '') {
            const fecha = new Date(fechaExacta);
            fecha.setHours(0, 0, 0, 0);
            const fechaSiguiente = new Date(fechaExacta);
            fechaSiguiente.setDate(fecha.getDate() + 1);
            [diarios, total] = await Promise.all([
                Diario.findOne({ idUsuario, fecha: { $gt:fechaExacta, $lt:fechaSiguiente } }),
                Diario.countDocuments({ idUsuario, fecha: { $gt:fechaExacta, $lt:fechaSiguiente } })
            ]);
        } else if(fechaDesde !== '' && fechaHasta !== '') {
            [diarios, total] = await Promise.all([
                Diario.find({ idUsuario, fecha: { $gt:fechaDesde, $lt:fechaHasta } }).skip(desde).limit(resultados),
                Diario.countDocuments({ idUsuario, fecha: { $gt:fechaDesde, $lt:fechaHasta } })
            ]);
        } else if(fechaDesde !== '') {
            [diarios, total] = await Promise.all([
                Diario.find({ idUsuario, fecha: { $gt:fechaDesde } }).skip(desde).limit(resultados),
                Diario.countDocuments({ idUsuario, fecha: { $gt:fechaDesde } })
            ]);
        } else if(fechaHasta !== '') {
            [diarios, total] = await Promise.all([
                Diario.find({ idUsuario, fecha: { $lt:fechaHasta } }).skip(desde).limit(resultados),
                Diario.countDocuments({ idUsuario, fecha: { $lt:fechaHasta } })
            ]);
        } else {
            [diarios, total] = await Promise.all([
                Diario.find({ idUsuario }).skip(desde).limit(resultados),
                Diario.countDocuments({ idUsuario })
            ]);
        }

        res.json({
            ok: true,
            msg: 'getDiariosByUser',
            diarios,
            page: {
                desde,
                resultados,
                total,
                fechaExacta,
                fechaDesde,
                fechaHasta
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniendo diarios por usuario'
        });
    }
}

const createDiario = async(req, res = response) => {

    // Cuando se crea un diario se hace con todos los valores por defecto, y luego se actualiza
    const { idUsuario, alimentosConsumidos, caloriasConsumidas, aguaConsumida, caloriasGastadas, 
        carbosConsumidos, proteinasConsumidas, grasasConsumidas, ...object } = req.body;

    let { fecha } = req.body;

    if(!fecha) {
        fecha = new Date();
    }

    try {

        const usuario = await Usuario.findById(idUsuario);

        // KO -> usuario no existe
        if(!usuario) {
            return res.status(400).json({
                ok:false,
                msg:"No existe ningún usuario para el id: " + idUsuario
            });
        }

        fecha.setHours(0, 0, 0, 0);
        const fechaSiguiente = new Date(fecha);
        fechaSiguiente.setDate(fecha.getDate() + 1);
        const existeDiario = await Diario.findOne({ fecha: { $gte: fecha, $lt: fechaSiguiente }, idUsuario });

        // OK -> si existe un diario no pasa nada, esta bien
        if(existeDiario) {
            return res.json({
                ok:true,
                msg:"createDiario - ya existia uno",
                existeDiario
            })
        }

        object.fecha = fecha;
        object.idUsuario = idUsuario;
        object.alimentosConsumidos = [];
        const diario = new Diario(object);

        await diario.save();

        // OK
        res.json({
            ok:true,
            msg:"createDiario",
            diario
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error creando diario'
        });
    }
}

const updateDiario = async(req, res = response) => {
    const { fecha, idUsuario, alimentosConsumidos, ...object } = req.body;
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

        // KO -> se esta intentado editar un diario de otro usuario
        if(infoToken(token).uid != idUsuario) {
            return res.status(400).json({
                ok:false,
                msg:"No se pueden editar diarios de otro usuario"
            });
        }

        let existeDiario = await Diario.findById(id);

        // KO -> no existe ningún diario con ese id
        if(!existeDiario) {
            return  res.status(400).json({
                ok: false,
                msg: "Este diario no existe"
            });
        }

        let caloriasConsumidas = existeDiario.caloriasConsumidas;
        let carbosConsumidos = existeDiario.carbosConsumidos;
        let proteinasConsumidas = existeDiario.proteinasConsumidas;
        let grasasConsumidas = existeDiario.grasasConsumidas;
        let nuevaListaAlimentos = existeDiario.alimentosConsumidos;

        if(alimentosConsumidos && alimentosConsumidos.length > 0) {
            for(let i = 0; i < alimentosConsumidos.length; i++) {
                const existeAlimento = await Alimento.findById(alimentosConsumidos[i].idAlimento);
                
                // KO -> no existe algún alimento
                if(!existeAlimento) {
                    return  res.status(400).json({
                        ok: false,
                        msg: "Algún alimento no existe"
                    });
                }

                const cantidad = alimentosConsumidos[i].cantidad;
                const cantidadReferencia = existeAlimento.cantidadReferencia;
    
                caloriasConsumidas += Math.round((existeAlimento.calorias * cantidad) / cantidadReferencia);
                carbosConsumidos += parseFloat(((existeAlimento.carbohidratos * cantidad) / cantidadReferencia).toFixed(2));
                proteinasConsumidas += parseFloat((existeAlimento.proteinas * cantidad) / cantidadReferencia);
                grasasConsumidas += parseFloat(((existeAlimento.grasas * cantidad) / cantidadReferencia).toFixed(2));

                nuevaListaAlimentos.push(alimentosConsumidos[i]);
            }
        }

        object.fecha = fecha;
        object.idUsuario = idUsuario;
        object.alimentosConsumidos = nuevaListaAlimentos;
        object.caloriasConsumidas = caloriasConsumidas;
        object.carbosConsumidos = carbosConsumidos;
        object.proteinasConsumidas = proteinasConsumidas;
        object.grasasConsumidas = grasasConsumidas;
        const diario = await Diario.findByIdAndUpdate(id, object, { new: true });

        // OK
        res.json({
            ok: true,
            msg: "updateDiario",
            diario
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error editando diario'
        });
    }
}

const deleteDiario = async(req, res = response) => {

    const id = req.params.id;
    const token = req.header('x-token');

    try {

        const existeDiario = await Diario.findById(id);

        // KO -> no existe ningún diario con ese id
        if(!existeDiario) {
            return res.status(400).json({
                ok: false,
                msg: "No existe ningún diario con ese id: " + id
            });
        }

        // KO -> se esta intentado eliminar un registro de otro usuario
        if(infoToken(token).uid != existeDiario.idUsuario) {
            return res.status(400).json({
                ok: false,
                msg: "No se pueden eliminar diarios de otro usuario"
            });
        }

        const diarioEliminado = await Diario.findByIdAndDelete(id);

        res.json({
            ok:true,
            msg:"deleteDiario",
            diarioEliminado
        })

    } catch(error){
        console.log(error);
        return res.json({
            ok: false,
            msg: 'Error borrando diario'
        })
    }
}

module.exports = {
    getDiarioById,
    getDiariosByUser,
    createDiario,
    updateDiario,
    deleteDiario
}