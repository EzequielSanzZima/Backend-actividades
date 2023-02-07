import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import config from './config.js'

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import parseArgs from 'minimist'
import { fork } from 'child_process'

import authWebRouter from './routers/web/auth.js'
import homeWebRouter from './routers/web/home.js'
import productosApiRouter from './routers/api/productos.js'

import addProductosHandlers from './routers/ws/productos.js'
import addMensajesHandlers from './routers/ws/mensajes.js'

import objectUtils from './utils/objectUtils.js'

import passport from 'passport'
import cookieParser from 'cookie-parser'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//--------------------------------------------
// minimist

const optionsM = {default:{p:8080}, alias:{p:"port"}}
const args = parseArgs(process.argv.slice(2),optionsM)

//--------------------------------------------
// instancio .env
import * as dotenv from 'dotenv'
const NODE_ENV = process.env.NODE_ENV || 'development'

dotenv.config({
    path: `.env.${NODE_ENV}`
})

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)
app.use(passport.initialize())

//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');
    addProductosHandlers(socket, io.sockets)
    addMensajesHandlers(socket, io.sockets)
});

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set('view engine', 'ejs');

app.use(cookieParser())
app.use(objectUtils.createOnMongoStore())

// MIDDLEWARE PASSPORT
app.use(passport.initialize())
app.use(passport.session())

import auth from './routers/web/auth.js'
const sessions = auth
app.use('/api/sessions', sessions)


//--------------------------------------------
// rutas del servidor API REST

app.use(productosApiRouter)

//--------------------------------------------
// rutas del servidor web

app.use(authWebRouter)
app.use(homeWebRouter)


//--------------------------------------------
// inicio el servidor

// let PORT;
// process.env.STATUS === 'development'
//  ? (PORT = process.env.DEV_PORT)
//  : (PORT = process.env.PROD_PORT)
const PORT = args.p 
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
