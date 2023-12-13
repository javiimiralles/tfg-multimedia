const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');

const {
    getDiarioById,
    getDiariosByUser,
    createDiario,
    updateDiario,
    deleteDiario,
} = require('../controllers/diarios.controller');

const router = Router();

router.get('/:id', [
    validarJWT,
    check('id','El id del diario debe ser valido').isMongoId(),
    validarCampos
], getDiarioById);

router.get('/usuario/:idUsuario', [
    validarJWT,
    check('idUsuario','El idUsuario del alimento debe ser valido').isMongoId(),
    check('desde','El argumento desde debe ser numérico').optional().isNumeric(),
    check('resultados','El argumento desde debe ser numérico').optional().isNumeric(),
    check('fechaExacta','El argumento fechaExacta desde debe ser una fecha').optional().isDate(),
    check('fechaDesde','El argumento fechaDesde desde debe ser una fecha').optional().isDate(),
    check('fechaHasta','El argumento fechaHasta desde debe ser una fecha').optional().isDate(),
    validarCampos
], getDiariosByUser);

router.post('/', [
    validarJWT,
    // check('alimentosConsumidos.idAlimento','El id del alimento debe ser valido').optional().isMongoId(),
    // check('alimentosConsumidos.cantidad','El argumento alimentosConsumidos.cantidad debe ser numérico').optional().isNumeric(),
    // check('aguaConsumida','El argumento aguaConsumida debe ser numérico').optional().isNumeric(),
    // check('caloriasGastadas','El argumento caloriasGastadas debe ser numérico').optional().isNumeric(),
    // check('caloriasConsumidas','El argumento caloriasConsumidas debe ser numérico').optional().isNumeric(),
    // check('carbosConsumidos','El argumento carbosConsumidos debe ser numérico').optional().isNumeric(),
    // check('proteinasConsumidas','El argumento proteinasConsumidas debe ser numérico').optional().isNumeric(),
    // check('grasasConsumidas','El argumento grasasConsumidas debe ser numérico').optional().isNumeric(),
    check('idUsuario','El id del usuario debe ser valido').isMongoId(),
    validarCampos
], createDiario);

router.put('/:id', [
    validarJWT,
    check('id','El id del diario debe ser valido').isMongoId(),
    check('alimentosConsumidos.idAlimento','El id del alimento debe ser valido').optional().isMongoId(),
    check('alimentosConsumidos.cantidad','El argumento alimentosConsumidos.cantidad debe ser numérico').optional().isNumeric(),
    check('aguaConsumida','El argumento aguaConsumida debe ser numérico').optional().isNumeric(),
    check('caloriasGastadas','El argumento caloriasGastadas debe ser numérico').optional().isNumeric(),
    check('caloriasConsumidas','El argumento caloriasConsumidas debe ser numérico').optional().isNumeric(),
    check('carbosConsumidos','El argumento carbosConsumidos debe ser numérico').optional().isNumeric(),
    check('proteinasConsumidas','El argumento proteinasConsumidas debe ser numérico').optional().isNumeric(),
    check('grasasConsumidas','El argumento grasasConsumidas debe ser numérico').optional().isNumeric(),
    check('idUsuario','El id del usuario debe ser valido').isMongoId(),
    validarCampos
], updateDiario);

router.delete('/:id', [
    validarJWT,
    check('id','El id del diario debe ser valido').isMongoId(),
    validarCampos
], deleteDiario);

module.exports = router;