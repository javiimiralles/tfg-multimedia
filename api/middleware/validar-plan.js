const { response } = require("express");
const planes = ['Perder peso', 'Mantener peso', 'Ganar peso'];

const validarPlan = (req, res = response, next) => {
    const plan = req.body.plan.tipo;
    
    if(plan && !planes.includes(plan)){
        return res.status(400).json({
            ok: false,
            errores:'Plan no permitido'
        });
    }
    next();
}

module.exports = { validarPlan };