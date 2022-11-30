const socketClient = io();

const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const product = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
  };

  socketClient.emit("newProduct", product);
});

const productsContainer = document.getElementById("productsContainer");

socketClient.on("allProducts", async (data) => {
  //productos
  const templateTable = await fetch("./templates/products.handlebars");
  const templateFormat = await templateTable.text();

  const template = Handlebars.compile(templateFormat);

  const html = template({ products: data });
  productsContainer.innerHTML = html;
});

const chatForm = document.getElementById("chatForm");

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("messageEmail").value;
  const msg = document.getElementById("messageChat").value;
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const hora = getDate();

  if (msg == "" && email == "") {
    alert("no dejes ningun campo vacio");
    return;
  }
  if (email !== "" && !regexEmail.test(email)) {
    alert("escribi bien el email");
    return;
  }

  if (msg == "" && email !== "") {
    alert("Escribi algo");
    return;
  }
  if (msg !== "" && email == "") {
    alert("Ingresa un email");
    return;
  }

  const mensajes = {
    email: email,
    date: hora,
    msg: msg,
  };

  document.getElementById("messageChat").value = "";
  socketClient.emit("newMsgs", mensajes);
});

const getDate = () => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const dateFormated = `${date.getDate()}/${month}/${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return dateFormated;
};

const chatContainer = document.getElementById("chatContainer");
socketClient.on("allMessages", async (data) => {
  const templateMessage = await fetch("./templates/chat.handlebars");
  const templateFormat = await templateMessage.text();

  const template = Handlebars.compile(templateFormat);

  const html = template({ mensajes: data });

  chatContainer.innerHTML = html;
});
