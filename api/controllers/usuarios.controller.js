const Usuario = require('../models/usuario.model');
const RegistroPeso = require('../models/registro-peso.model');
const Alimento = require('../models/alimento.model');
const Diario = require('../models/diario.model');
const MedidaCorporal = require('../models/medida-corporal.model');
const ActividadFisica = require('../models/actividad-fisica.model');
const ActividadRealizada = require('../models/actividad-realizada.model');
const { response  }= require('express');
const bcrypt = require('bcryptjs');
const { createMedidasCorporalesDefault } = require('./medidas-corporales.controller');

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
        // No enviamos error 400 porque queremos que siga la ejecución
        if(!usuario) {
            return res.json({
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
        usuario.pesoActual = usuario.pesoInicial;

        await usuario.save();

        // Añadimos un primer registro de peso para el usuario 
        const registro = new RegistroPeso();
        registro.fecha = new Date();
        registro.peso = usuario.pesoInicial;
        registro.idUsuario = usuario._id;

        // Creamos unas medidas corporales por defecto
        await createMedidasCorporalesDefault(usuario._id);

        await registro.save();

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

    const { password, email, pesoInicial, pesoActual, pesoHistorico, ...object } = req.body;
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

const updatePassword = async(req, res = response) => {

    const uid = req.params.id;
    const { password, newPassword, newPassword2 } = req.body;

    try {
        const token = req.header('x-token');

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Este usuario no existe',
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        // Se comprueba que sabe la contraseña vieja y que ha puesto dos veces la contraseña nueva
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña es incorrecta',
                token: ''
            });
        }

        if (newPassword !== newPassword2) {
            return res.status(400).json({
                ok: false,
                msg: 'Las contraseñas no coinciden',
            });
        }

        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(newPassword, salt);
        usuarioBD.password = cpassword;

        // Almacenar en BD
        await usuarioBD.save();

        res.json({
            ok: true,
            msg: 'Contraseña actualizada'
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar contraseña',
        });
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

        // Eliminamos todos los registros del resto de colecciones que esten relacionadas con este usuario
        await Alimento.deleteMany({ idUsuario: uid });
        await RegistroPeso.deleteMany({ idUsuario: uid });
        await Diario.deleteMany({ idUsuario: uid });
        await MedidaCorporal.deleteMany({ idUsuario: uid });
        await ActividadRealizada.deleteMany({ idUsuario: uid });
        await ActividadFisica.deleteMany({ idUsuario: uid });

        // OK
        res.json({
            ok:true,
            msg:"deleteUser",
            usuarioEliminado
        })

    } catch(error){
        console.log(error);
        return res.json({
            ok: false,
            msg: 'Error borrando usuario'
        })
    }
}

module.exports = {
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    updatePassword,
    deleteUser,
}