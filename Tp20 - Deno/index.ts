import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

const router = new Router();

let products = [
  { id: "1", name: "Alfajor", price: "200" },
  { id: "2", name: "Chocolate", price: "362" },
  { id: "3", name: "Caramelo", price: "100" },
];

// Obtener todos los productos
router.get("/api/products", (ctx) => {
  ctx.response.body = products;
});

// Obtener un producto por su ID
router.get("/api/products/:id", (ctx) => {
  const product = products.find((p) => p.id === ctx.params.id);
  if (product) {
    ctx.response.body = product;
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "Producto no encontrado" };
  }
});

// Crear un nuevo producto
router.post("/api/products", async (ctx) => {
  const body = await ctx.request.body();
  const product = body.value;
  products.push(product);
  ctx.response.body = { message: "Producto creado" };
  ctx.response.status = 201;
});

// Actualizar un producto existente
router.put("/api/products/:id", async (ctx) => {
  const body = await ctx.request.body();
  const product = body.value;
  const index = products.findIndex((p) => p.id === ctx.params.id);
  if (index !== -1) {
    products[index] = { ...product, id: ctx.params.id };
    ctx.response.body = { message: "Producto actualizado" };
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "Producto no encontrado" };
  }
});

// Eliminar un producto
router.delete("/api/products/:id", (ctx) => {
  const index = products.findIndex((p) => p.id === ctx.params.id);
  if (index !== -1) {
    products.splice(index, 1);
    ctx.response.body = { message: "Producto eliminado" };
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "Producto no encontrado" };
  }
});

// Rutas
app.use(router.routes());
app.use(router.allowedMethods());

// Config servidor
console.log("Servidor iniciado en http://localhost:8080");
await app.listen({ port: 8080 });