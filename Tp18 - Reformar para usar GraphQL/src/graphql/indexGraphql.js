import { graphqlHTTP } from 'express-graphql'
import ProductosSchema from './squema.js'
import { obtenerProducto, obtenerProductos, eliminarProducto, agregarProducto, actualizarProducto } from './resolvers.js'

export const indexGraphql = 
    app.use('/graphql', graphqlHTTP({
    schema: ProductosSchema,
    rootValue: {
        obtenerProducto, 
        obtenerProductos, 
        eliminarProducto, 
        agregarProducto,
        actualizarProducto},
    graphiql: true,
}))

