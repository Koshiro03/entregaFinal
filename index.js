require('dotenv').config();
require('./database/conexion');

const express = require('express');
const cors = require('cors');
const path = require('path');
const hbs = require('hbs');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cors());

//Configuración de Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.use('/api', require('./router/auth'));

/* Rendering the login page. */
app.get('/', (req, res) =>{
    res.render('login')
});

/* Listening to the port 3000. */
app.listen(PORT, () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);    
});

// Por si hay error
app.on('Error', (err) => {
    console.log('Tenemos un error en el Espacio');
})