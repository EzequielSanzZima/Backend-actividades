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

//----------Chat-----

const authorSchema = new normalizr.schema.Entity('authors',{}, {idAttribute:"mail"});
const textSchema = new normalizr.schema.Entity('text');
const mensajeSchema = new normalizr.schema.Entity('messages', {
    author: authorSchema,
    text: [textSchema]
});

const chatForm = document.getElementById("chatForm");

const inputEmail= document.getElementById("authorId")
const inputName = document.getElementById("authorName");
const inputLastName = document.getElementById("authorLastName");
const inputAge = document.getElementById("authorAge");
const inputUsername = document.getElementById("authorUsername");
const inputAvatar = document.getElementById("authorAvatar");
const inputMensaje = document.getElementById("inputMensaje");
const btnEnviar = document.getElementById("btnEnviar");

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const emailValue = inputEmail.value;
  const nameValue = inputName.value;
  const lastNameValue = inputLastName.value;
  const ageValue = inputAge.value;
  const inputUsernameValue = inputUsername.value;
  const avatarValue = inputAvatar.value;
  const date = new Date().toLocaleDateString('es-ES')
  const time = new Date().toLocaleTimeString();
  const textValue = inputMensaje.value;
  // const regexEmail =
  //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // if (msg == "" && email == "") {
  //   alert("no dejes ningun campo vacio");
  //   return;
  // }
  // if (email !== "" && !regexEmail.test(email)) {
  //   alert("escribi bien el email");
  //   return;
  // }

  // if (msg == "" && email !== "") {
  //   alert("Escribi algo");
  //   return;
  // }
  // if (msg !== "" && email == "") {
  //   alert("Ingresa un email");
  //   return;
  // }

  const mensajes = {
    author: {
      mail: emailValue,
      name: nameValue,
      lastName: lastNameValue,
      age: ageValue,
      username: inputUsernameValue,
      avatar: avatarValue,
    },
    text: textValue,
    date: date + " " + time
  };

  document.getElementById("messageChat").value = "";
  socketClient.emit("newMsgs", mensajes);
});

// const getDate = () => {
//   const date = new Date();
//   const month = date.getMonth() + 1;
//   const dateFormated = `${date.getDate()}/${month}/${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
//   return dateFormated;
// };

socket.on("message", mensajesN => {
  // Dernomalizamos los mensajes recibidos por el socket y los integramos al html
  let mensajesDenormalized = normalizr.denormalize(mensajesN.result, [mensajeSchema], mensajesN.entities)
  const html = makeHtmlList(mensajesDenormalized)
  document.getElementById('mensajes').innerHTML = html;
  
  // Guardamos el tamaño de la data y hacemos el porcentaje
  let mensajesNsize = JSON.stringify(mensajesN).length
  console.log(mensajesN, mensajesNsize);
  let mensajesDsize = JSON.stringify(mensajesDenormalized).length
  console.log(mensajesDenormalized, mensajesDsize);

  // Logica del porcentaje
  let porcentajeC = parseInt((mensajesNsize * 100) / mensajesDsize)
  console.log(`Porcentaje de compresión ${porcentajeC}%`)
  document.getElementById('compresion-info').innerText = porcentajeC
});

const chatContainer = document.getElementById("chatContainer");
socketClient.on("allMessages", async (data) => {
  const templateMessage = await fetch("./templates/chat.handlebars");
  const templateFormat = await templateMessage.text();

  const template = Handlebars.compile(templateFormat);

  const html = template({ messages: data });

  chatContainer.innerHTML = html;
});
