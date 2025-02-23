use serde::{Deserialize, Serialize};
use tokio_postgres::{NoTls, Error, Client, Row};
use tauri::Manager;
use serde_json::json;

#[derive(Serialize, Deserialize, Debug)]
pub struct DatabaseConfig {
    host: String,
    port: u16,
    user: String,
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
        Ok(_) => {
            // Başarılı bağlantı durumunda tüm pencerelere event emit et
            app_handle.emit_all("database-connection", json!({
                "status": "success",
                "message": "Connected successfully"
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
async fn get_schemas() -> Result<Vec<SchemaInfo>, String> {
    let (client, connection) = match tokio_postgres::connect(
        "host=localhost user=postgres password=your_password dbname=your_database",
        NoTls,
    ).await {
        Ok((client, connection)) => (client, connection),
        Err(e) => return Err(e.to_string()),
    };

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    let rows = match client
        .query(
            "SELECT schema_name FROM information_schema.schemata 
             WHERE schema_name NOT LIKE 'pg_%' 
             AND schema_name != 'information_schema'",
            &[],
        )
        .await
    {
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
async fn get_tables(schema: &str) -> Result<Vec<TableInfo>, String> {
    let (client, connection) = match tokio_postgres::connect(
        "host=localhost user=postgres password=your_password dbname=your_database",
        NoTls,
    ).await {
        Ok((client, connection)) => (client, connection),
        Err(e) => return Err(e.to_string()),
    };

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    let rows = match client
        .query(
            "SELECT table_schema, table_name, table_type 
             FROM information_schema.tables 
             WHERE table_schema = $1",
            &[&schema],
        )
        .await
    {
        Ok(rows) => rows,
        Err(e) => return Err(e.to_string()),
    };

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
async fn get_functions(schema: &str) -> Result<Vec<FunctionInfo>, String> {
    let (client, connection) = match tokio_postgres::connect(
        "host=localhost user=postgres password=your_password dbname=your_database",
        NoTls,
    ).await {
        Ok((client, connection)) => (client, connection),
        Err(e) => return Err(e.to_string()),
    };

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    let rows = match client
        .query(
            "SELECT 
                n.nspname as schema,
                p.proname as name,
                pg_get_function_result(p.oid) as return_type,
                pg_get_function_arguments(p.oid) as arguments
             FROM pg_proc p 
             LEFT JOIN pg_namespace n ON p.pronamespace = n.oid 
             WHERE n.nspname = $1",
            &[&schema],
        )
        .await
    {
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
