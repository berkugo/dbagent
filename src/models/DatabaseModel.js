class DatabaseModel {
    constructor(connectionId) {
        this.connectionId = connectionId;
        this.schemas = [];
        this.isConnected = false;
        this.connectionInfo = {
            name: '',
            host: '',
            port: '',
            database: '',
            username: ''
        };
    }

    setConnection(connectionInfo) {
        this.isConnected = true;
        this.connectionInfo.name = connectionInfo.name;
        this.connectionInfo.host = connectionInfo.host;
        this.connectionInfo.port = connectionInfo.port;
        this.connectionInfo.database = connectionInfo.database;
        this.connectionInfo.username = connectionInfo.username; 
    }

    setSchemaData(data) {
        this.schemas = [{
            name: data.schema,
            tables: data.tables.map(table => ({
                name: table.name,
                type: table.type,
                columns: table.columns || []
            })),
            functions: data.functions.map(func => ({
                name: func.name,
                returnType: func.return_type,
                arguments: func.arguments
            }))
        }];
    }

    getSchemas() {
        return this.schemas;
    }

    getTablesBySchema(schemaName) {
        const schema = this.schemas.find(s => s.name === schemaName);
        return schema ? schema.tables : [];
    }

    getFunctionsBySchema(schemaName) {
        const schema = this.schemas.find(s => s.name === schemaName);
        return schema ? schema.functions : [];
    }

    disconnect() {
        this.isConnected = false;
        this.schemas = [];
    }
}

export default DatabaseModel; 