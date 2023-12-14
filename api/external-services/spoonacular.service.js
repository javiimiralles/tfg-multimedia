const axios = require('axios');
const { Router } = require('express');

const router = Router();

router.get('/alimentos', [], getAlimentos = async(req, res = response) => {

    const { query, ingredients } = req.params;
    const params = {
        query: query,
        ingredients: ingredients,
        apiKey: process.env.SPOONACULAR_APIKEY
    }

    // Hacer la petición GET al endpoint con los parámetros definidos
    axios.get(process.env.SPOONACULAR_URL, { params }).then(response => {

        res.json({
            ok: true,
            msg: 'getAlimentos',
            response
        });

    }).catch(error => {
        console.error(error);
        return res.json({
            ok: false,
            msg: 'Ha ocurrido un error buscando alimentos',
        });
    });
})

module.exports = router;
