use serde::Serialize;
use serde_json::json;
use tauri::{AppHandle, Manager};

use crate::database_connectors::postgres::queries::*;
use crate::database_connectors::postgres::postgres_connector::ClientState;

#[derive(Serialize)]
pub struct ColumnInfo {
    name: String,
    data_type: String,
    is_nullable: bool,
    is_primary_key: bool,
    is_foreign_key: bool,
    description: Option<String>,
}

#[derive(Serialize)]
pub struct TableData {
    columns: Vec<ColumnInfo>,
    rows: Vec<serde_json::Value>,
    total_rows: i64,
}

#[tauri::command]
pub async fn get_table_data(
    app_handle: AppHandle,
    connection_id: String,
    schema: &str, 
    table: &str, 
    limit: i64, 
    offset: i64
) -> Result<TableData, String> {
    println!("connection_id: {}", connection_id);
    // Get client from state
    let client_arc = {
        let state = app_handle.state::<ClientState>();
        match state.get_client(&connection_id) {
            Some(client) => client,
            None => return Err("Database connection not found".to_string()),
        }
    };
    
    // Get columns
    let columns = match client_arc.query(
        GET_COLUMNS, 
        &[&schema, &table]  // Şema ve tablo adını ayrı parametreler olarak geçirin
    ).await {
        Ok(rows) => rows.iter().map(|row| ColumnInfo {
            name: row.get(0),
            data_type: row.get(1),
            is_nullable: row.get(2),
            is_primary_key: row.get(3),
            is_foreign_key: row.get(4),
            description: row.get(5),
        }).collect(),
        Err(e) => return Err(format!("Failed to get columns: {}", e)),
    };

    // Get row count
    let count_query = format!("SELECT COUNT(*) FROM {}.{}", schema, table);
    let total_rows = match client_arc.query(&count_query, &[]).await {
        Ok(rows) => rows[0].get(0),
        Err(e) => return Err(format!("Failed to get row count: {}", e)),
    };

    // Get rows
    let rows_query = format!("SELECT * FROM {}.{} LIMIT $1 OFFSET $2", schema, table);
    let rows = match client_arc.query(&rows_query, &[&limit, &offset]).await {
        Ok(rows) => rows.iter().map(|row| {
            let mut obj = serde_json::Map::new();
            for (i, column) in row.columns().iter().enumerate() {
                let value = match column.type_() {
                    // Metin türleri
                    &tokio_postgres::types::Type::TEXT | 
                    &tokio_postgres::types::Type::VARCHAR | 
                    &tokio_postgres::types::Type::CHAR => {
                        match row.try_get::<_, Option<String>>(i) {
                            Ok(Some(v)) => json!(v),
                            Ok(None) => json!(null),
                            Err(_) => json!(null),
                        }
                    },
                    // Sayısal türler
                    &tokio_postgres::types::Type::INT4 => {
                        match row.try_get::<_, Option<i32>>(i) {
                            Ok(Some(v)) => json!(v),
                            Ok(None) => json!(null),
                            Err(_) => json!(null),
                        }
                    },
                    // Diğer türler için varsayılan
                    _ => {
                        match row.try_get::<_, Option<String>>(i) {
                            Ok(Some(v)) => json!(v),
                            Ok(None) => json!(null),
                            Err(_) => json!(null),
                        }
                    }
                };
                obj.insert(column.name().to_string(), value);
            }
            json!(obj)
        }).collect(),
        Err(e) => return Err(format!("Failed to get rows: {}", e)),
    };

    Ok(TableData {
        columns,
        rows,
        total_rows,
    })
} 