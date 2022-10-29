const Container = require("./class.js")
const products = new Container("./products.json")

async function eject(){
    const object1={
        name:"Shirt",
        price:20,
        thumbnail:"url.com/url"
    }
   const object2={
    nombre:"Pants",
    price:25,
    thumbnail:"url.com/url"
    }
    const object3={
        name:"Shoe",
        price:30,
        thumbnail:"url.com/url"
    }
    const object4={
        name:"Stocking",
        price:10,
        thumbnail:"url.com/urll"
    }

await products.save(object1)
await products.save(object2)
await products.save(object3)
await products.save(object4)
await products.getAll()
await products.getByid(2).then(id=>console.log(id))
await products.deleteById(2)
await products.deleteById(1)
await products.getAll()
await products.getByid(3).then(id=>console.log(id))
await products.getAll()

}
eject()