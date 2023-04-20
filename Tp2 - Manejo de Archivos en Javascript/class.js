const fs=require("fs").promises

class Container{
    constructor(path){
        this.path=path
    }

    async save(object){
        try{
            const read = await fs.readFile(this.path,"utf-8");
            const data = JSON.parse(read)
            let id;
                data.length === 0
                    ? (id = 1)
                    : (id = data[data.length - 1].id + 1);  
            const newProduct = { ...object, id };
            data.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8")
            return newProduct.id;
        }catch(e){
            console.log(e)
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

    async getAll(){
        const read = await fs.readFile(this.path,'utf-8');
        return JSON.parse(read)
    }

    async deleteById(id){
        try{
            let read = await this.getAll()
            let item = read.find((element) => element.id === id);
            let index = read.indexOf(item);
            read.splice(index, 1);
            await fs.writeFile(this.path, JSON.stringify(read, null, 2), "utf-8")
        }catch(e){
            console.log(e)
        }
    }

    async deleteAll(){
        try {
            await fs.writeFile(this.path, JSON.stringify([], null, 2), "utf-8")
        } catch (e) {
            console.log(e)
        }
    }
}
module.exports = Container