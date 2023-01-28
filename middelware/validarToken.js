const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'myprivatekey';

const validarToken = (req, res, next) => {

    //funcionan las variables
    const data = req.headers['token'] || req.query.token;

    const token = req.header('token');

    console.log(token);

    if(!token){
        return res.status(401).json({ 
            ok: false,
            mensaje: 'No tienes token'
        })
    } 

    try {
        const payload = jwt.verify(token, PRIVATE_KEY);
        console.log(payload);

    } catch (error) {
        console.log(error);
    }


    next();
}

module.exports = validarToken;