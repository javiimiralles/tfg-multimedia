const Usuario = require('../models/usuario.model');
const ActividadFisica = require('../models/actividad-fisica.model');
const { response } = require('express');
const { infoToken } = require('../utils/infotoken');

const getActividadFisicaById = async(req, res = response) => {

    const id = req.params.id;

    try {

        const actividad = await ActividadFisica.findById(id);

        // KO -> actividad no existe
        if(!actividad) {
            return res.status(400).json({
                ok: false,
                msg: "No existe ninguna actividad para el id: " + id
            });
        }

        // OK 
        res.json({
            ok: true,
            msg: 'getActividadFisicaById',
            actividad
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniendo actividad por id'
        });
    }
}

const getActividadesFisicasByFilter = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const resultados = Number(req.query.resultados) || Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;

    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }

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

        const filter = {
            $or: [
                { idUsuario: idUsuario },
                { predeterminada: true }
            ]
        };

        if (texto) {
            filter.$or.push({ nombre: textoBusqueda });
        }

        const [actividades, total] = await Promise.all([
            ActividadFisica.find(filter).skip(desde).limit(resultados),
            ActividadFisica.countDocuments(filter)
        ]);

        res.json({
            ok: true,
            msg: 'getActividadesFisicasByFilter',
            actividades,
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
            msg: 'Error obteniendo actividades por filtro'
        });
    }
}

const createActividadFisica = async(req, res = response) => {

    const { nombre, idUsuario, ...object } = req.body;

    try {

        const usuario = await Usuario.findById(idUsuario);

        // KO -> usuario no existe
        if(!usuario) {
            return res.status(400).json({
                ok:false,
                msg:"No existe ningún usuario para el id: " + idUsuario
            });
        }

        const existeActividad = await ActividadFisica.findOne({
            $or: [
                { nombre: nombre, idUsuario: idUsuario },
                { nombre: nombre, predeterminada: true }
            ]
        });

        // KO -> existe una actividad fisica con ese nombre
        // No mandamos status 400 porque queremos que siga funcionando
        if(existeActividad) {
            return  res.json({
                ok:false,
                msg:"Ya existe una actividad física con ese nombre",
                alimento: existeActividad
            });
        }

        object.nombre = nombre;
        object.idUsuario = idUsuario;
        object.predeterminada = false; // un usuario nunca podra crear una predeterminada
        const actividad = new ActividadFisica(object);

        await actividad.save();

        // OK
        res.json({
            ok:true,
            msg:"createActividadFisica",
            actividad
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error creando actividad fisica'
        });
    }

}

const updateActividadFisica = async(req, res = response) => {

    const { nombre, idUsuario, ...object } = req.body;
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
                msg:"No se pueden editar actividades de otro usuario"
            });
        }

        let existeActividad = await ActividadFisica.findById(id);
        // KO -> No se pueden editar actividades predeterminadas
        if(existeActividad.predeterminada) {
            return res.status(400).json({
                ok:false,
                msg:"No se pueden editar actividades predeterminadas"
            });
        }

        existeActividad = await ActividadFisica.findOne({
            $or: [
                { nombre: nombre, idUsuario: idUsuario },
                { nombre: nombre, predeterminada: true }
            ]
        });

        // KO -> existe una actividad fisica con ese nombre
        // No mandamos status 400 porque queremos que siga funcionando
        if(existeActividad && existeActividad._id != id) {
            return res.json({
                ok:false,
                msg:"Ya existe una actividad física con ese nombre",
                alimento: existeActividad
            });
        }

        object.nombre = nombre;
        object.idUsuario = idUsuario;
        const actividad = await ActividadFisica.findByIdAndUpdate(id, object, { new: true });

         // OK
        res.json({
            ok:true,
            msg:"updateActividadFisica",
            actividad
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error editando actividad fisica'
        });
    }
}

const deleteActividadFisica = async(req, res = response) => {

    const id = req.params.id;
    const token = req.header('x-token');

    try {

        const existeActividad = await ActividadFisica.findById(id);

        // KO -> no existe ninguna actividad con ese id
        if(!existeActividad) {
            return res.status(400).json({
                ok:false,
                msg:"No existe ninguna actividad con ese id: " + id
            });
        }

        // KO -> No se pueden borrar actividades predeterminadas
        if(existeActividad.predeterminada) {
            return res.status(400).json({
                ok:false,
                msg:"No se pueden borrar actividades predeterminadas"
            });
        }

        // KO -> se esta intentado eliminar una actividad de otro usuario
        if(infoToken(token).uid != existeActividad.idUsuario) {
            return res.status(400).json({
                ok:false,
                msg:"No se pueden eliminar actividades de otro usuario"
            });
        }

        const actividadEliminada = await ActividadFisica.findByIdAndDelete(id);

        res.json({
            ok:true,
            msg:"deleteActividadFisica",
            actividadEliminada
        })

    } catch(error){
        console.log(error);
        return  res.json({
            ok:false,
            msg:'Error borrando actividad fisica'
        })
    }

}

module.exports = {
    getActividadFisicaById,
    getActividadesFisicasByFilter,
    createActividadFisica,
    updateActividadFisica,
    deleteActividadFisica
}