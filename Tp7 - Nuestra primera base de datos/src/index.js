const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const { ContenedorSQL } = require('./container/containerSQL.js')
const { options } = require('./connectDatabase/dbConnect.js')

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

const products = new ContenedorSQL(options.mariaDB, 'products')
const messages = new ContenedorSQL(options.sqliteDB, 'messages')

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
  socket.emit("allMessages", await messages.getAll());

  //obtenemos mensaje
  socket.on("newMsgs", async (data) => {
    await messages.save(data);

    io.sockets.emit("allMessages", await messages.getAll());
  });
});

app.get("/", (req, res) => {
  res.render("form");
});
