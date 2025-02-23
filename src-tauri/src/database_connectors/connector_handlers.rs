
pub fn connector_handlers() -> impl Fn(tauri::Invoke) {
    tauri::generate_handler![
        crate::database_connectors::postgres::postgres_connector::connect_database
    ]
}