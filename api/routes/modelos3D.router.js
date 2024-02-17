const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');
const { getUrlModelo3DById, getUrlModelo3DByUser, subirModelo3D } = require('../controllers/modelos3D.controller');
const router = Router();

router.get('/:id', [
    validarJWT,
    check('id','El id del modelo debe ser valido').isMongoId(),
    validarCampos
], getUrlModelo3DById);

router.get('/usuario/:idUsuario', [
    validarJWT,
    check('idUsuario','El idUsuario del usuario debe ser valido').isMongoId(),
    validarCampos
], getUrlModelo3DByUser);

router.post('/', [
    validarJWT,
    check('idUsuario','El idUsuario del usuario debe ser valido').isMongoId(),
    validarCampos
], subirModelo3D);

module.exports = router;