const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

const Products = require('./class.js')
const products = new Products()

app.get('/', (req, res) => {
  res.render('form.ejs', {mensaje: 'Ingrese un producto'})
})

const getProducts = products.getProducts();
app.get('/productos', (req, res)=>{
    if( getProducts == false){
        res.render('products',{
            getProducts,
            error: "No hay productos para mostrar"
        })
    }else{
        res.render('products',{
            getProducts
        })
    }
})

app.post('/productos',(req,res)=>{
    products.addProduct(req.body);
    res.redirect('/productos')
})


//Informacion del servidor
const port = 8080
const server = app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`)
})

server.on('error', error => console.log(`Error en el servidor ${error}`))