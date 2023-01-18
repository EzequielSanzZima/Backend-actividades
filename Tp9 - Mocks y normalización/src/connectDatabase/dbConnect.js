const path = require("path");

const options = {
    fileSystem: {
        path: './DB'
    },
    mariaDB: {
        client: "mysql",
        connection: {
            host: "127.0.0.1",
            user: "root",
            password: "",
            database: "sys"
        }
    },
    sqliteDB: {
        client: "sqlite",
        connection: {
            filename: path.join(__dirname, "../db/chatdb.sqlite")
        },
        useNullAsDefault: true
    }
}

module.exports = { options };