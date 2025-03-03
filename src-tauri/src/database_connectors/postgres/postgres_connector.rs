use serde::{Deserialize, Serialize};
use tokio_postgres::{NoTls, Error, Client, Row};
use tauri::Manager;
use serde_json::json;
use std::sync::{Arc, Mutex};
use std::collections::HashMap;

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

#[derive(Serialize, Debug)]
struct TableInfo {
    schema: String,
    name: String,
    type_: String,
}

#[derive(Serialize, Debug)]
struct FunctionInfo {
    schema: String,
    name: String,
    return_type: String,
    arguments: String,
}

#[derive(Serialize, Debug)]
struct SchemaInfo {
    name: String,
}

// Client'ları tutacak state yapısı
pub struct ClientState {
    pub clients: Mutex<HashMap<String, Arc<Client>>>
}

impl ClientState {
    pub fn new() -> Self {
        ClientState {
            clients: Mutex::new(HashMap::new())
        }
    }
    
    pub fn add_client(&self, id: String, client: Arc<Client>) {
        let mut clients = self.clients.lock().unwrap();
        clients.insert(id, client);
    }
    
    pub fn get_client(&self, id: &str) -> Option<Arc<Client>> {
        let clients = self.clients.lock().unwrap();
        clients.get(id).cloned()
    }
}

#[tauri::command]
pub async fn connect_database(app_handle: tauri::AppHandle, config: DatabaseConfig) -> Result<String, String> {
    let connection_string = format!(
        "host={} port={} user={} password={} dbname={}",
        config.host, config.port, config.user, config.password, config.database
    );

    let connection_result = tokio_postgres::connect(&connection_string, NoTls).await;

    if let Ok((client, connection)) = connection_result {
        tokio::spawn(async move {
            if let Err(e) = connection.await {
                eprintln!("connection error: {}", e);
            }
        });

        // Client'ı Arc içine al
        let client_arc = Arc::new(client);
        
        // Client'ı Tauri state'ine kaydet
        let connection_id = format!("{}:{}", config.host, config.database);
        {
            let state = app_handle.state::<ClientState>();
            state.add_client(connection_id.clone(), Arc::clone(&client_arc));
        }

        // Arc içindeki client'ı kullan
        let schemas_result = get_schemas(&client_arc).await;
        let schemas = if let Ok(s) = schemas_result {
            s
        } else {
            return Err(format!("Failed to get schemas: {}", schemas_result.unwrap_err()));
        };

        // Her schema için tablo ve fonksiyon bilgilerini al
        let mut all_data = Vec::new();
        for schema in schemas {
            let tables_result = get_tables(&client_arc, &schema.name).await;
            let tables = if let Ok(t) = tables_result {
                t
            } else {
                return Err(format!("Failed to get tables: {}", tables_result.unwrap_err()));
            };

            let functions_result = get_functions(&client_arc, &schema.name).await;
            let functions = if let Ok(f) = functions_result {
                f
            } else {
                return Err(format!("Failed to get functions: {}", functions_result.unwrap_err()));
            };

            all_data.push(json!({
                "connection_id": connection_id,
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
    } else {
        let error_message = match connection_result {
            Err(e) => e.to_string(),
            _ => "Unknown connection error".to_string()
        };
        
        // Hata durumunda tüm pencerelere event emit et
        app_handle.emit_all("database-connection", json!({
            "status": "error",
            "message": &error_message
        })).unwrap();
        
        Err(error_message)
    }
}

#[tauri::command]
async fn get_schemas(client: &Arc<Client>) -> Result<Vec<SchemaInfo>, String> {
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
async fn get_tables(client: &Arc<Client>, schema: &str) -> Result<Vec<TableInfo>, String> {
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
async fn get_functions(client: &Arc<Client>, schema: &str) -> Result<Vec<FunctionInfo>, String> {
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
