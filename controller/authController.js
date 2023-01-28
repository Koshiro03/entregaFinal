const Usuario = require('../models/userModels');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
//const { generarToken } = require('../middelware/generarToken');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'myprivatekey';


//Función para generar el Token al Usuario
const generarToken = (user) => {

    return new Promise((resolve, reject) => {
        jwt.sign(
            {user},
            PRIVATE_KEY,
            { expiresIn: '1h'},
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('Error generando el Token')
                }
                resolve(token)
            }
        );
    })

}

const userCreate = async (req, res) => {

    //1. Validamos los datos que llegan
    const errores = validationResult(req)
    
    if(!errores.isEmpty()){
        console.log(errores);
        return res.render('error', {
            /* errores: errores */
            mensaje: 'Registro con Errores'
        })
    }

    //Probamos el post
    const { nombre, email, password } = req.body;
    console.log(`1. ${nombre}, ${email}, ${password}`);

    //2. Verificamos si el email no se repite
    try {
        let usuario = await Usuario.findOne({ email })
        console.log(`2. ${usuario}`); 
        
        if(usuario){
            return res.render('error', {
                mensaje: 'El usuario ya existe'
            })
        } 

    //3. Si el mail NO se repite, creamos al Usuario
        usuario = new Usuario(req.body);
        console.log(usuario); 

    //4. Generamos la encriptación del usuario
        const salt = bcrypt.genSaltSync();
        console.log(`La encriptación automática es ${salt}`);

    //5.Mezclamos la encriptación con el password
        usuario.password = bcrypt.hashSync(password, salt);
        console.log(`3. La mezcla es: ${usuario.password}`);

    //6. Guardamos el usuario en la database
        await usuario.save();

    //6. Creamos el Token de acceso al usuario
        const token = await generarToken(usuario);
        console.log(token);


        //. Respuesta de el POST
        res.render('completo', {
            mensaje: 'Datos recibidos y encriptados',
            token
        });

    //6. proximente token
        
    } catch (error) {
        console.log(error);
        return res.render('error', {
            mensaje: 'Perdimos la Conexión!!!'
        })
    }

    
}



const userLogin = async (req, res) => {

    console.log('=======================================');

    //const data = req.headers['token']

    //console.log(data);

    console.log('=======================================');
    
    let validacion = 'Email o Contraseña incorrectos';

    //1. Recibimos los datos para el login
    const { email, password } = req.body;
    console.log(`4. Los datos son: ${email} - ${password}`);

    try {
    //2. Confirmar el email
        let usuario = await Usuario.findOne({ email });
        console.log(`5. ${usuario}`);
        if(!usuario){
            /*  return res.status(404).json({ 
                msg: 'Usuario o contraseña incorrectos'
            }) */
            return res.render('login', {
                validacion
            });
        }

    //3. Confirmamos la contraseña
        const validacionPassword = bcrypt.compareSync(password, usuario.password);
        console.log(`6. ${validacionPassword}`);

        if(!validacionPassword){
            /* return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos'
            }) */
            return res.render('login', {
                validacion
            });
        }
        
        //Respuesta general
/*         res.json({
            mge: 'Usuario logueado exitosamente',
            id: usuario.id,
            name: usuario.nombre,
            email: usuario.email,
        }); */

        let token = generarToken(usuario);
        res.render('home', {
            token,
            usuario: `${usuario.nombre}`
        })

    } catch (error) {
        /* res.status(500).json({
            msg: 'Error al ingresar a la aplicación'
        }) */
        res.render('login', {
            validacion
        });
    }
}

const pruebaDatos = (req, res) =>{
    let validacion = 'Bienvenido';
    const { email, password } = req.body;
    console.log(`Los datos son: ${email} - ${password}`);
    res.render('home', {
        validacion
    })
}

module.exports = {
    userCreate,
    userLogin,
    pruebaDatos
}