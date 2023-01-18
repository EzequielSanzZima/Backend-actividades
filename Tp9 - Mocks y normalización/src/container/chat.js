const fs = require("fs");
const { options } = require('../connectDatabase/dbConnect.js')

class Messages {
  constructor(ruta) {
    this.ruta = `${options.fileSystem.path}/${ruta}`;
}

async getMessage(id) {
    const objs = await this.listarAll()
    const buscado = objs.find(o => o.id == id)
    return buscado
}

async getAll() {
    try {
        const objs = fs.readFileSync(this.ruta, 'utf-8')
        return JSON.parse(objs)
    } catch (error) {
        console.log(error);
        return []
    }
}

async save(obj) {
    const objs = await this.listarAll()
    let newId
    if (objs.length == 0) {
        newId = 1
    } else {
        newId = objs[objs.length - 1].id + 1
    }
    const newObj = { ...obj, id: newId }
    objs.push(newObj)
    try {
        await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
        return newObj
    } catch (error) {
        throw new Error(`Error al guardar: ${error}`)
    }
}

async actualizate(elem) {
    const objs = await this.listarAll()
    const index = objs.findIndex(o => o.id == elem.id)
    if (index == -1) {
        throw new Error(`Error al actualizar: no se encontró el id ${id}`)
    } else {
        objs[index] = elem
        try {
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
        } catch (error) {
            throw new Error(`Error al actualizar: ${error}`)
        }
    }
}

async delete(id) {
    const objs = await this.listarAll()
    const index = objs.findIndex(o => o.id == id)
    if (index == -1) {
        throw new Error(`Error al borrar: no se encontró el id ${id}`)
    }

    objs.splice(index, 1)
    try {
        await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
    } catch (error) {
        throw new Error(`Error al borrar: ${error}`)
    }
}

async deleteAll() {
    try {
        await fs.writeFile(this.ruta, JSON.stringify([], null, 2))
    } catch (error) {
        throw new Error(`Error al borrar todo: ${error}`)
    }
}
}
module.exports = Messages;
