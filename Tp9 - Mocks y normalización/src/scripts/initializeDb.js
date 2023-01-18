const { options } = require("../connectDatabase/dbConnect");
const knex = require("knex");

const databaseMariaDb = knex(options.mariaDB);
const databaseSqlite = knex(options.sqliteDB);

const createTables = async () => {
  try {
    let productTable = await databaseMariaDb.schema.hasTable("products");
    if (productTable) {
      await databaseMariaDb.schema.dropTable("products");
    }
    await databaseMariaDb.schema.createTable("products", (table) => {
      table.increments("id");
      table.string("title", 40).nullable(false);
      table.integer("price").nullable(false);
      table.string("thumbnail", 200).nullable(false);
    });
    console.log("products table created");

    let messageTable = await databaseSqlite.schema.hasTable("messages");
    if (messageTable) {
      await databaseSqlite.schema.dropTable("messages");
    }
    await databaseSqlite.schema.createTable("messages", (table) => {
      table.increments("id");
      table.string("email", 40).nullable(false);
      table.string("date", 20);
      table.string("msg", 200);
    });
    console.log("messages table created");
  } catch (error) {
    console.log("error", error);
  }
  databaseMariaDb.destroy();
  databaseSqlite.destroy();
};
createTables();
