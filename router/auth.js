const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { 
    userCreate,
    userLogin,
    pruebaDatos
} = require('../controller/authController');
const validarToken = require('../middelware/validarToken');
const { generarToken } = require('../middelware/generarToken');


/*
Esta ruta responde a /api
*/

router.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a la API'
    })
});

router.get('/registro', (req, res) => {
    res.render('registro')
});

router.post('/create', [
    check('nombre').isLength({min:5}),
    check('email').isEmail(),
    check('password').isLength({min:8})
], userCreate);

router.post('/login', [
    check('email').isEmail(),
    check('password').isLength({min:8}),
], userLogin)

router.post('/prueba', [
    check('email').isEmail(),
    check('password').isLength({min:8}),
    validarToken
], pruebaDatos)

module.exports = router;