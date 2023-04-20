const express = require('express');

const app = express();
const { Router } = express;
const productsApi = require('./class.js');
const PORT = 8080;

// router de producto

const apiProducts = new productsApi();
const routerProducts =  Router();

routerProducts.use(express.json());
routerProducts.use(express.urlencoded({ extended: true }));

//Rutas
// Obtener todos los productos
routerProducts.get("/", (req, res)=>{
    res.json(apiProducts.getProducts());
});
// Obtener por ID
routerProducts.get("/:id",(req, res)=>{
    res.json(apiProducts.getProductsById(req.params.id));
})
// Subir item
routerProducts.post("/", (req, res) => {
    res.json(apiProducts.addProduct(req.body));
});
// Actualizar item
routerProducts.put("/", (req, res) => {
    res.json(apiProducts.Actualizate(req.body));
});
// Eliminar objeto
routerProducts.delete("/:id", (req, res) => {
    res.json(apiProducts.deleteById(req.params.id));
});

//Server config
app.use(express.static('public'));
app.use('/api/productos', routerProducts);


const server = app.listen(PORT, () => {
    console.log(`Server run on port ${server.address().port}'`);
});
server.on('error', error => console.log(`Server error: ${error}`));