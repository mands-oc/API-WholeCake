require ('dotenv').config(); 
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const db = require('./db/db');

const clienteRoutes = require('./routes/clienteroutes'); 
const entregadorRoutes = require('./routes/entregadorroutes');
const pedidoRoutes = require('./routes/pedidoroutes');
const produtoRoutes = require('./routes/produtoroutes');
const avaliacaoRoutes = require('./routes/avaliacaoroutes');
const categoriaRoutes = require('./routes/categoriaroutes');
const itempedidoRoutes = require('./routes/itempedidoroutes');

const { METHODS } = require('http');

const corsOptions = {
    origin: ['http://localhost:3333', 'http://127.0.0.1:5504', 'http://localhost:5504'], //Lista de origens permitidas
    methods: 'GET, POST, PUT, PATCH, DELETE', //Métodos HTTP permitidos
    credentials: true, //Permite o envio de cookies
    allowedHeaders: ['Content-Type', '*'], //Cabeçalhos permitidos
    exposedHeaders: ['Content-Length', 'X-Total-Count'], //Cabeçalhos expostos 
};

const app = express(); //O APP IRÁ RECEBER O EXPRESS E TODAS SUAS DEPENDÊNCIAS 
// Middlewares de segurança e utilidades
app.use(helmet()); //Protege a aplicação com headers de segurança
app.use(cors(corsOptions)); //Habilita o CORS
app.use(express.urlencoded({extended:false}));
app.use(morgan('dev')); //Loga as requisições no console
app.use(express.json()); //Converte os dados recebidos para JSON


app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'pages', 'home.html'))
});


//app.use('/', routes);
app.use('/', clienteRoutes);
app.use('/', entregadorRoutes);
app.use('/', pedidoRoutes);
app.use('/', produtoRoutes);
app.use('/', avaliacaoRoutes);
app.use('/', categoriaRoutes);
app.use('/', itempedidoRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});


const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});