class Products {
    constructor(title, price, thumbnail) {
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
    }
    products =[];

    async getProductsById(id) {
        const obj = this.products.find(element =>element.id == id);
        if (obj == undefined){
            return { error: "Producto no encontrado"};
        }else{
            return obj;
        }
    }

    getProducts() {
        return this.products;
    }

    addProduct(prod) {
        if(this.products.length > 0){
            const auxId = this.products[this.products.length - 1].id + 1;
            const obj = {
                id: auxId,
                title: prod.title,
                price: prod.price,
                thumbnail: prod.thumbnail
            }
            this.products.push(obj);
            return obj;
        }else{
            const obj = {
                id: 1,
                title: prod.title,
                price: prod.price,
                thumbnail: prod.thumbnail
            }
            this.products.push(obj);
            return obj;
        }
    }

    async Actualizate(prod) {
        const obj = {
            id: prod.id,
            title: prod.title,
            price: prod.price,
            thumbnail: prod.thumbnail
        }
        const product = this.products.find(products => products.id === prod.id)
        if (product == undefined){
            return { error: 'No existe ese producto con esa ID'}
        }else{
            const filteredProducts = this.products.filter(products => products.id !== prod.id);
            filteredProducts.push(obj);
            this.products = filteredProducts;
            return { success: "Se ha actualizado el producto", products: this.products };
        }
    }

    async deleteById(id) {
        const product = this.products.find(products => products.id == id);
        if (product == undefined) {
            return { error: "No existe producto con ese id" };
        } else {
            const filteredProducts = this.products.filter(products => products.id != id);
            console.log(filteredProducts);
            this.products = filteredProducts;
            return { success: `Se ha eliminado el producto con el id: ${id}`, newProducts: this.products };
        }
    }
}

module.exports = Products