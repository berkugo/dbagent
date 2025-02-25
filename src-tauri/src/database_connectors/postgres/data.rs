use serde::Serialize;
use tokio_postgres::Client;
use serde_json::json;

use crate::database_connectors::postgres::queries::*;

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
    client: &Client, 
    schema: &str, 
    table: &str, 
    limit: i64, 
    offset: i64
) -> Result<TableData, String> {
    // Get columns
    let table_oid = format!("{}.\"{}\""
        , schema
        , table.replace("\"", "\"\"")
    );
    
    let columns = match client.query(GET_COLUMNS, &[&table_oid]).await {
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
    let count_query = GET_ROW_COUNT.replace("{}", schema).replace("{}", table);
    let total_rows = match client.query(&count_query, &[]).await {
        Ok(rows) => rows[0].get(0),
        Err(e) => return Err(format!("Failed to get row count: {}", e)),
    };

    // Get rows
    let rows_query = GET_ROWS.replace("{}", schema).replace("{}", table);
    let rows = match client.query(&rows_query, &[&limit, &offset]).await {
        Ok(rows) => rows.iter().map(|row| {
            let mut obj = serde_json::Map::new();
            for (i, column) in row.columns().iter().enumerate() {
                let value = match row.try_get::<_, Option<&str>>(i) {
                    Ok(Some(v)) => json!(v),
                    Ok(None) => json!(null),
                    Err(_) => json!(null),
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