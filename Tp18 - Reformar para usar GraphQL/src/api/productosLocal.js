import config from '../config/config.js'

import ContenedorArchivo from '../container/ContenedorMemoria.js'

const productosApi = new ContenedorArchivo(`${config.fileSystem.path}/products.json`)

export default productosApi