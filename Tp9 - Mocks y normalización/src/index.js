const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const { ContenedorSQL } = require("./container/containerSQL.js");
const { options } = require("./connectDatabase/dbConnect.js");
const  { normalize, schema } = require('normalizr');
const util = require('util') 
const { faker } = require('@faker-js/faker');
faker.locale = "es_MX";


//-------------
const path = require("path");
const viewsFolder = path.join(__dirname, "views");

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", viewsFolder);
app.set("view engine", "handlebars");

//Informacion del servidor
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});

server.on("error", (error) => console.log(`Error en el servidor ${error}`));

const products = new ContenedorSQL(options.mariaDB, "products");
// const messages = new ContenedorSQL(options.sqliteDB, "messages");
const Messages = require("./container/chat.js");
const messages = new Messages();


//---------Normalizr--------
function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true));
}
const authorSchema = new schema.Entity('authors',{}, {idAttribute:"mail"});
const textSchema = new schema.Entity('text');
const mensajeSchema = new schema.Entity('messages', {
    author: authorSchema,
    text: [textSchema]
});

async function listarMensajesN() {
  const archivoMensajes = await messages.getAll()
  const normalizados = normalizarMensajes(archivoMensajes)
  print(normalizados)
  return normalizados
}
const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, [mensajeSchema])


const io = new Server(server);

io.on("connection", async (socket) => {
  console.log(`Cliente conectado.\nID: ${socket.id}`);

  //productos
  socket.emit("allProducts", await products.getAll());

  socket.on("newProduct", async (data) => {
    await products.save(data);

    io.sockets.emit("allProducts", await products.getAll());
  });

  //mensajes
  listarMensajesN()
  .then((mensajesN)=>{
      socket.emit('message', mensajesN)
  })   

  // socket.emit("allMessages", await messages.getAll());

  //obtenemos mensaje
  socket.on("newMsgs", async (data) => {
    await messages.save(data);
        listarMensajesN()
        .then((res)=>{
            io.sockets.emit('mensajes',res)
        })
  });
});

app.get("/", (req, res) => {
  res.render("form");
});

//--------Faker JS--------

function createRandomData() {
  return {
    "randomProduct": faker.commerce.product(),
    "price": faker.commerce.price(),
    "thumbnail": faker.image.imageUrl(),
  };
}
app.get("/api/productos-test", async (req, res) => {
  let productRandom = [];
  for (i = 0; i < 5; i++) {
    productRandom.push(createRandomData())
  }
  res.json(productRandom);
});



