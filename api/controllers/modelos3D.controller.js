const { response } = require('express');
const Modelo3D = require('../models/modelo3D.model');
const fs = require('fs');
const stream = require('stream');

// inicializamos firebase
const admin = require('firebase-admin');
const serviceAccount = require('../database/firebase-credentials.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const getUrlModelo3DById = async(req, res = response) => {

    const idModelo = req.params.id;

    try {

        const modelo3D = await Modelo3D.findById(idModelo);

        // No devolvemos status porque queremos que siga funcionando
        if (!modelo3D) {
            return res.json({
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

        // No devolvemos status porque queremos que siga funcionando
        if (!modelo3D) {
            return res.json({
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

    // Comprobar si el usuario ya tiene un modelo asignado y borrarlo de Firebase
    const existeModelo3D = await Modelo3D.findOne({ idUsuario });
    if (existeModelo3D) {
        try {
            await bucket.file(existeModelo3D.nombre).delete();
        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al eliminar el modelo 3D existente',
                error
            });
        }
        await Modelo3D.findByIdAndDelete(existeModelo3D._id);
    }

    // Subir el nuevo archivo a Firebase
    const nombreArchivo = `${idUsuario}_${Date.now()}_${archivoModelo.name}`;
    const archivoModeloPath = `modelos3D/${nombreArchivo}`;
    const bucket = admin.storage().bucket();

    const blob = bucket.file(archivoModeloPath);
    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: archivoModelo.mimetype
        }
    });

    blobStream.on('error', (error) => {
        console.error('Error al subir el archivo:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al subir el archivo a Firebase Storage',
            error
        });
    });

    blobStream.on('finish', async () => {
        await blob.makePublic();
        const publicUrl = blob.publicUrl();
    
        // Crear un nuevo registro en la base de datos con la URL pública
        const nuevoModelo3D = new Modelo3D({
            url: publicUrl,
            nombre: nombreArchivo,
            idUsuario: idUsuario
        });
    
        try {
            await nuevoModelo3D.save();

            // OK
            res.json({
                ok: true,
                msg: 'Modelo 3D subido correctamente',
                modelo3D: nuevoModelo3D
            });
        } catch (error) {
            console.error('Error al guardar el modelo en la base de datos:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Error al guardar la información del modelo 3D en la base de datos',
                error
            });
        }
    });

    const bufferStream = new stream.PassThrough();
    bufferStream.end(archivoModelo.data);
    bufferStream.pipe(blobStream);
}

module.exports = {
    getUrlModelo3DById,
    getUrlModelo3DByUser,
    subirModelo3D
}