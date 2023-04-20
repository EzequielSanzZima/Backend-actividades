const express = require('express')
const fs = require('fs').promises
const app = express()

const PORT  = 8080

class Container{
    constructor(path){
        this.path = path
    }
    async getAll(){
        try{
            const read = await fs.readFile(this.path,'utf-8');
            return JSON.parse(read)
        }catch(e){
            console.log(e)
            return 'No se encontro el archivo'
        }
    }
    async getByid(id){
        try{
            const read = await fs.readFile(this.path,"utf-8");
            const data = JSON.parse(read)
            const obj = data.find(element =>element.id === id)
            if(!obj){
                return null
            }
            return obj
        }
        catch(e){
            console.log(e);
        }
    }
}
const productList = new Container("./products.json")

function randomNumber(min, max){
    return Math.round(Math.random() * (max - min + 1) + min);
}

//Puerto del servidor
const server = app.listen(PORT,()=>{
    console.log(`Servidor express con puerto ${PORT}`)
})

//Paginas
app.get('/productos', async (req, res)=>{
    const getProducts = await productList.getAll()
    res.send(getProducts)
    
})

app.get('/productosRandom', async (req, res)=>{
    const products = await productList.getAll()
    const getProducts = await productList.getByid(randomNumber(0, products.length))
    res.send(getProducts)
})

//Por si hay error
server.on('error', error => console.log(`Error en el servidor ${error}`))

