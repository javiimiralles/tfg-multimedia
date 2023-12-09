const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');
const { validarSexo } = require('../middleware/validar-sexo');

const {
    getUserById,
    getUserByEmail,
    createUser, 
    updateUser,
    deleteUser
} = require('../controllers/usuarios.controller');

const router= Router();

router.get('/id/:id', [
    validarJWT,
    check('id','El id de usuario debe ser valido').isMongoId(),
    validarCampos,
], getUserById);

router.get('/email/:email', [
    validarJWT,
    check('email','El argumento email es obligatorio').not().isEmpty(),
    check('email','El argumento email debe ser un email').isEmail(),
    validarCampos,
], getUserByEmail);

router.post('/',[
    // validarJWT,
    check('nombre','El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('email','El argumento email es obligatorio').not().isEmpty(),
    check('email','El argumento email debe ser un email').isEmail(),
    check('password','El argumento password es obligatorio').not().isEmpty(),
    check('sexo','El argumento sexo es obligatorio').not().isEmpty(),
    check('altura','El argumento altura es obligatorio').not().isEmpty(),
    check('altura','El argumento altura debe ser numérico').optional().isNumeric(),
    check('edad','El argumento edad es obligatorio').not().isEmpty(),
    check('edad','El argumento edad debe ser numérico').optional().isNumeric(),
    check('pesoInicial','El argumento pesoInicial es obligatorio').not().isEmpty(),
    check('pesoInicial','El argumento pesoInicial debe ser numérico').optional().isNumeric(),
    validarSexo,
    validarCampos
], createUser);

router.put('/:id', [
    validarJWT,
    check('id','El identificador no es válido').isMongoId(),
    check('nombre','El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('email','El argumento email es obligatorio').not().isEmpty(),
    check('email','El argumento email debe ser un email').isEmail(),
    check('sexo','El argumento sexo es obligatorio').not().isEmpty(),
    check('altura','El argumento altura es obligatorio').not().isEmpty(),
    check('altura','El argumento altura debe ser numérico').optional().isNumeric(),
    check('edad','El argumento edad es obligatorio').not().isEmpty(),
    check('edad','El argumento edad debe ser numérico').optional().isNumeric(),
    check('pesoInicial','El argumento pesoInicial es obligatorio').not().isEmpty(),
    check('pesoInicial','El argumento pesoInicial debe ser numérico').optional().isNumeric(),
    validarSexo,
    validarCampos
], updateUser);

router.delete('/:id', [
    validarJWT,
    check('id','el identificador no es válido').isMongoId(),
    validarCampos
], deleteUser);

module.exports = router;