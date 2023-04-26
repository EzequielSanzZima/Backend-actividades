import { Context, helpers, config, MongoClient, ObjectId } from "../../deps.ts";
import { Product } from "../types/product.ts";

//Mongo connection
const { MONGO_URL, DATABASE_NAME } = config();
const client = new MongoClient();
try {
    await client.connect(MONGO_URL);
    console.log('Connected to MongoDB');
} catch (error) {
    console.error(error);
}

//Mongo instance
const db = client.database(DATABASE_NAME);
const productModel = db.collection<Product>('products');


export const getProducts = async (ctx: Context) => {
    try {
        const products = await productModel.find().toArray()
        ctx.response.status = 200
        ctx.response.body = { status: 'success', data: products }
    } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = `Hubo un error: ${error}`;
    }
}

export const getProductById = async (ctx: Context) => {
    try {
        const { id } = helpers.getQuery(ctx, { mergeParams: true })
        const product = await productModel.findOne({ _id: new ObjectId(id) })
        ctx.response.status = 200
        ctx.response.body = { status: 'success', data: product }
    } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = `Hubo un error: ${error}`;
    }
}

export const createProduct = async (ctx: Context) => {
    try {
        const product = await ctx.request.body().value
        const productCreated = await productModel.insertOne(product)
        ctx.response.status = 201
        ctx.response.body = { status: 'success', data: productCreated, message: 'Producto creado correctamente' }
    } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = `Hubo un error: ${error}`;
    }
}

export const updateProductById = async (ctx: Context) => {
    try {
        const { id } = helpers.getQuery(ctx, { mergeParams: true })
        const { name, price, thumbnail } = await ctx.request.body().value;

        const updatedProduct = await productModel.updateOne(
            { _id: new ObjectId(id) },
            { $set: { name, price, thumbnail } },
        );

        ctx.response.status = 201
        ctx.response.body = { status: 'success', data: updatedProduct, message: 'Producto actualizado correctamente' }
    } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = `Hubo un error: ${error}`;
    }
}

export const deleteProductById = async (ctx: Context) => {
    try {
        const { id } = helpers.getQuery(ctx, { mergeParams: true })
        const deletedProduct = await productModel.deleteOne({ _id: new ObjectId(id) })

        ctx.response.status = 201
        ctx.response.body = { status: 'success', data: deletedProduct, message: 'Producto eliminado correctamente' }
    } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = `Hubo un error: ${error}`;
    }
}