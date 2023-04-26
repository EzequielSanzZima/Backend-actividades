import { Application, config, Router, Context } from "../deps.ts";
import { productRouter } from "./routes/products.routes.ts";

const { PORT } = config();
const portParseado = parseInt(PORT);

// Oak Server
const app = new Application();

app.use(productRouter.routes());

app.listen({ port: portParseado });
console.log(`Server running on port ${portParseado}`);
