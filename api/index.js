const express = require('express');
const fileUpload= require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const { dbConnection } = require('./database/configdb');

require('dotenv').config();

const app = express();
dbConnection();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.use(express.json());
app.use(fileUpload ({
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    createParentPath: true
}));
app.use(bodyParser.json());

// Rutas
app.use('/api/login', require('./routes/auth.router'));
app.use('/api/usuarios', require('./routes/usuarios.router'));
app.use('/api/alimentos', require('./routes/alimentos.router'));
app.use('/api/registros-peso', require('./routes/registros-peso.router'));
app.use('/api/diarios', require('./routes/diarios.router'));
app.use('/api/medidas-corporales', require('./routes/medidas-corporales.router'));
app.use('/api/actividades-fisicas', require('./routes/actividades-fisicas.router'));
app.use('/api/actividades-realizadas', require('./routes/actividades-realizadas.router'));

app.use('/api/open-food-facts', require('./external-services/open-food-facts.service'));

app.listen(process.env.PORT, ()=>{
  console.log('Servidor en puerto: ' + process.env.PORT);
});