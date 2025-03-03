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

    getColumnsByTable(schemaName, tableName) {
        
        const schema = this.schemas.find(s => s.name === schemaName);
        const table = schema?.tables.find(t => t.name === tableName);
        return table ? table.columns : [];
    }

    getFunctionsBySchema(schemaName) {
        const schema = this.schemas.find(s => s.name === schemaName);
        return schema ? schema.functions : [];
    }

    disconnect() {
        this.isConnected = false;
        this.schemas = [];
    }

    updateTableData(schemaName, tableName, tableData) {
        const schema = this.schemas.find(s => s.name === schemaName);
        if (!schema) return;
        
        const table = schema.tables.find(t => t.name === tableName);
        if (!table) return;
        
        // Update the table with the fetched data
        table.columns = tableData.columns;
        table.rows = tableData.rows;
        table.totalRows = tableData.total_rows;
    }

    updateTableColumns(schema, table, columns) {
        if (!this.schemas) return;
        
        const schemaObj = this.schemas.find(s => s.name === schema);
        if (!schemaObj) return;
        
        const tableObj = schemaObj.tables.find(t => t.name === table);
        if (!tableObj) return;
        
        tableObj.columns = columns;
    }

    getColumnsByTable(schema, table) {
        if (!this.schemas) return [];
        
        const schemaObj = this.schemas.find(s => s.name === schema);
        if (!schemaObj) return [];
        
        const tableObj = schemaObj.tables.find(t => t.name === table);
        return tableObj?.columns || [];
    }
}

export default DatabaseModel; 