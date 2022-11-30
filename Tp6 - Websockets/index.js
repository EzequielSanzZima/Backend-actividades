const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
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

const Products = require("./container/products.js");
const products = new Products();

const Messages = require("./container/chat.js");
const messages = new Messages();

const io = new Server(server);

io.on("connection", async (socket) => {
  console.log(`Cliente conectado.\nID: ${socket.id}`);

  //productos
  socket.emit("allProducts", await products.getProducts());

  socket.on("newProduct", async (data) => {
    await products.addProduct(data);

    await products.getProducts();
    io.sockets.emit("allProducts", await products.getProducts());
  });

  //mensajería
  socket.emit("allMessages", await messages.getMessages());

  //recibimos el mensaje
  socket.on("newMsgs", async (data) => {
    await messages.newMsg(data, messages.getMessages);

    socket.emit("allMessages", await messages.getMessages());

    io.sockets.emit("allMessages", await messages.getMessages());
  });
});

app.get("/", (req, res) => {
  res.render("form");
});
