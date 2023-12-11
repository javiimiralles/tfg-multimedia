const Usuario = require('../models/usuario.model');
const { response  }= require('express');
const bcrypt = require('bcryptjs');

const getUserById = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const usuario = await Usuario.findById(uid);

        // KO -> usuario no existe
        if(!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "No existe ningún usuario para el id: " + uid
            });
        }

        // OK 
        res.json({
            ok: true,
            msg: 'getUserById',
            usuario
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniendo usuario por id: ' + uid
        });
    }
}

const getUserByEmail = async(req, res = response) => {
    const email = req.params.email;

    try {
        const usuario = await Usuario.findOne({ email });

        // KO -> usuario no existe
        if(!usuario) {
            return res.status(400).json({
                ok:false,
                msg:"No existe ningún usuario para el email: " + email
            });
        }

        // OK 
        res.json({
            ok: true,
            msg: 'getUserByEmail',
            usuario
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniendo usuario por email: ' + email
        });
    }
}

const createUser = async(req, res = response) => {

    const { email, password } = req.body;

    try{
        const existeEmail = await Usuario.findOne({ email });

        // KO -> existe un usuario con ese email
        if(existeEmail){
            return  res.status(400).json({
                ok: false,
                msg:"Ya existe un usuario con este email: " + email
            })
        }
    
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(password, salt);

        const object = req.body;
        const usuario = new Usuario(object);
        usuario.password = cpassword;

        // ToDo -> Calcular calorias y macros
        usuario.plan.caloriasDiarias = 2000;
        usuario.plan.carbosDiarios = 150;
        usuario.plan.proteinasDiarias = 130;
        usuario.plan.grasasDiarias = 50;

        // Establecemos los pesos historicos del usuario
        usuario.pesoHistorico.pesoMedio = usuario.pesoInicial;
        usuario.pesoHistorico.pesoMaximo = usuario.pesoInicial;
        usuario.pesoHistorico.pesoMinimo = usuario.pesoInicial;

        await usuario.save();

        res.json({
            ok:true,
            msg:"createUser",
            usuario
        });
    }
    catch(error){
        console.log(error);
        return  res.status(400).json({
            ok: false,
            msg:'Error creando usuario'
        })
    }
}

const updateUser = async(req, res = response) => {

    const { password, email, activo, pesoHistorico, ...object } = req.body;
    const uid = req.params.id;

    try {
        const existeUsuario= await Usuario.findById(uid);
        // KO -> no existe el usuario
        if(!existeUsuario){
            return  res.status(400).json({
                ok:false,
                msg:'El usuario no existe'
            })
        }
    
        const existeEmail = await Usuario.findOne({ email });
    
        // KO -> existe un usuario con ese email
        if(existeEmail && existeEmail._id != uid) {
            return  res.status(400).json({
                ok: false,
                msg:"Ya existe un usuario con este email: " + email
            });
        }
    
        object.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, object, { new: true }); 
    
        res.json({
            ok:true,
            msg:"updateUser",
            usuarioActualizado
        })
    } catch(error){
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg:'Error actualizando usuario'
        })
    }
}

const deleteUser = async(req, res = response) => {
    const uid = req.params.id;

    try {

        const existeUsuario = await Usuario.findById(uid);

        // KO -> no existe el usuario
        if(!existeUsuario){
            return res.status(400).json({
                ok:false,
                msg:"El usuario no existe"
            });
        }

        const usuarioEliminado = await Usuario.findByIdAndDelete(uid);

        // OK
        res.json({
            ok:true,
            msg:"deleteUser",
            usuarioEliminado
        })

    } catch(error){
        console.log(error);
        return  res.status(400).json({
            ok:false,
            msg:'Error borrando usuario'
        })
    }
}

module.exports = {
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
}