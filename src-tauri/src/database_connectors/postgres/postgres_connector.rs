use serde::{Deserialize, Serialize};
use tokio_postgres::{NoTls, Error, Client, Row};
use tauri::Manager;
use serde_json::json;

use crate::database_connectors::postgres::queries::*;

#[derive(Serialize, Deserialize, Debug)]
pub struct DatabaseConfig {
    host: String,
    port: u16,
    user: String,
    connection_name: String,
    password: String,
    database: String,
    db_type: String
}

#[derive(Serialize)]
struct TableInfo {
    schema: String,
    name: String,
    type_: String,
}

#[derive(Serialize)]
struct FunctionInfo {
    schema: String,
    name: String,
    return_type: String,
    arguments: String,
}

#[derive(Serialize)]
struct SchemaInfo {
    name: String,
}

#[tauri::command]
pub async fn connect_database(app_handle: tauri::AppHandle, config: DatabaseConfig) -> Result<String, String> {
    let connection_string = format!(
        "host={} port={} user={} password={} dbname={}",
        config.host, config.port, config.user, config.password, config.database
    );

    match tokio_postgres::connect(&connection_string, NoTls).await {
        Ok((client, connection)) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });

            // Schema bilgilerini al
            let schemas = match get_schemas(&client).await {
                Ok(schemas) => schemas,
                Err(e) => return Err(format!("Failed to get schemas: {}", e)),
            };

            // Her schema için tablo ve fonksiyon bilgilerini al
            let mut all_data = Vec::new();
            for schema in schemas {
                let tables = match get_tables(&client, &schema.name).await {
                    Ok(tables) => tables,
                    Err(e) => return Err(format!("Failed to get tables: {}", e)),
                };

                let functions = match get_functions(&client, &schema.name).await {
                    Ok(functions) => functions,
                    Err(e) => return Err(format!("Failed to get functions: {}", e)),
                };

                all_data.push(json!({
                    "name": config.connection_name,
                    "host": config.host,    
                    "port": config.port,
                    "username": config.user,
                    "database": config.database,
                    "schema": schema.name,
                    "tables": tables,
                    "functions": functions,
                }));
            }

            // Başarılı bağlantı ve veri durumunda tüm pencerelere event emit et
            app_handle.emit_all("database-connection", json!({
                "status": "success",
                "message": "Connected successfully",
                "data": all_data
            })).unwrap();
            
            Ok("Connected successfully".to_string())
        },
        Err(e) => {
            let error_message = e.to_string();
            // Hata durumunda tüm pencerelere event emit et
            app_handle.emit_all("database-connection", json!({
                "status": "error",
                "message": &error_message
            })).unwrap();
            
            Err(error_message)
        }
    }
}

#[tauri::command]
async fn get_schemas(client: &Client) -> Result<Vec<SchemaInfo>, String> {
    let rows = match client.query(GET_SCHEMAS, &[]).await {
        Ok(rows) => rows,
        Err(e) => return Err(e.to_string()),
    };

    Ok(rows
        .iter()
        .map(|row| SchemaInfo {
            name: row.get(0),
        })
        .collect())
}

#[tauri::command]
async fn get_tables(client: &Client, schema: &str) -> Result<Vec<TableInfo>, String> {
    println!("Searching for tables in schema: {}", schema);
    
    let debug_rows = match client.query(DEBUG_TABLES, &[]).await {
        Ok(rows) => rows,
        Err(e) => return Err(e.to_string()),
    };

    // Debug bilgisini yazdır
    for row in debug_rows.iter() {
        let schema: &str = row.get(0);
        let table: &str = row.get(1);
        let owner: &str = row.get(2);
        println!("Found table: {}.{} (owner: {})", schema, table, owner);
    }

    let rows = match client.query(GET_TABLES, &[&schema]).await {
        Ok(rows) => rows,
        Err(e) => return Err(e.to_string()),
    };

    println!("Found {} tables in schema {}", rows.len(), schema);

    Ok(rows
        .iter()
        .map(|row| TableInfo {
            schema: row.get(0),
            name: row.get(1),
            type_: row.get(2),
        })
        .collect())
}

#[tauri::command]
async fn get_functions(client: &Client, schema: &str) -> Result<Vec<FunctionInfo>, String> {
    let rows = match client.query(GET_FUNCTIONS, &[&schema]).await {
        Ok(rows) => rows,
        Err(e) => return Err(e.to_string()),
    };

    Ok(rows
        .iter()
        .map(|row| FunctionInfo {
            schema: row.get(0),
            name: row.get(1),
            return_type: row.get(2),
            arguments: row.get(3),
        })
        .collect())
}
