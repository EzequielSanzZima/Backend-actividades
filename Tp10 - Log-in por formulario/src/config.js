export default {
    PORT: process.env.PORT || 8080,
    mongoLocal: {
        client: 'mongodb',
        cnxStr: 'mongodb://localhost:27017'
    },
    mongoRemote: {
        client: 'mongodb',
        cnxStr: 'mongodb+srv://admin:admin@admin.mongodb.net/ecommerce',
        options: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                // useCreateIndex: true,
                // serverSelectionTimeoutMS: 5000,
        }    
    },
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: `./DB/ecommerce.sqlite`
        },
        useNullAsDefault: true
    },
    fileSystem: {
        path: './DB'
    }
}