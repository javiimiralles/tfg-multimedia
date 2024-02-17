const cloudinary = require('cloudinary').v2;
const { response } = require('express');
const Modelo3D = require('../models/modelo3D.model');
const fs = require('fs');

const getUrlModelo3DById = async(req, res = response) => {

    const idModelo = req.params.id;

    try {

        const modelo3D = await Modelo3D.findById(idModelo);

        if (!modelo3D) {
            return res.status(404).json({
                ok: false,
                msg: "Modelo 3D no encontrado."
            });
        }

        // OK
        res.json({
            ok: true,
            msg: "getUrlModelo3DById",
            url: modelo3D.url
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno al obtener el modelo 3D'
        });
    }
}

const getUrlModelo3DByUser = async(req, res = response) => {

    const idUsuario = req.params.idUsuario;

    try {

        const modelo3D = await Modelo3D.findOne({ idUsuario });

        if (!modelo3D) {
            return res.status(404).json({
                ok: false,
                msg: "Modelo 3D no encontrado."
            });
        }

        // OK
        res.json({
            ok: true,
            msg: "getUrlModelo3DByUser",
            url: modelo3D.url
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno al obtener el modelo 3D'
        });
    }
}

const subirModelo3D = async(req, res = response) => {
    if (!req.files || !req.files.archivoModelo) {
        return res.status(400).json({
            ok: false,
            msg: "No se ha subido ningún archivo"
        });
    }

    const archivoModelo = req.files.archivoModelo;
    const idUsuario = req.body.idUsuario;

    // Comprobar el tipo de archivo por mimetype
    if (!['model/gltf+json', 'model/gltf-binary'].includes(archivoModelo.mimetype)) {
        return res.status(400).json({
            ok: false,
            msg: "El archivo debe ser un modelo GLTF o GLB."
        });
    }

    // Definir la ruta temporal donde se guardará el archivo
    const archivoModeloPath = `./uploadsModelos3D/${archivoModelo.name}`;

    try {
        // Mover el archivo al directorio temporal
        await new Promise((resolve, reject) => {
            archivoModelo.mv(archivoModeloPath, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        // Subir el archivo a Cloudinary
        cloudinary.uploader.upload(archivoModeloPath, {
            resource_type: 'raw'
        }, async function(error, result) {
            if (error) {
                console.log(error);
                return res.status(400).json({
                    ok: false,
                    msg: "Error al cargar el archivo a Cloudinary"
                });
            }

            // borramos el archivo temporal
            fs.unlinkSync(archivoModeloPath);

            // si el usuario ya tiene un modelo creado lo eliminamos
            // tanto de la bd como de cloudinary
            const existeModelo3D = await Modelo3D.findOne({ idUsuario });
            if(existeModelo3D) {
                await Modelo3D.findByIdAndDelete(existeModelo3D._id);
                cloudinary.uploader.destroy(existeModelo3D.idCloudinary, { resource_type: 'raw' }, (error, result) => {
                    if(error) {
                        console.log(error);
                        return res.status(400).json({
                            ok: false,
                            msg: 'Error al eliminar el modelo 3D ya existente',
                        });
                    }
                })
            }

            // Crear un nuevo registro en la colección Modelo3D
            const modelo3D = new Modelo3D({
                url: result.secure_url,
                idCloudinary: result.public_id,
                idUsuario: idUsuario
            });

            await modelo3D.save();

            // OK
            res.json({
                ok: true,
                msg: "Modelo 3D subido correctamente",
                modelo3D
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno al subir el modelo 3D'
        });
    }
}


module.exports = {
    getUrlModelo3DById,
    getUrlModelo3DByUser,
    subirModelo3D
}