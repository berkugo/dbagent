
pub fn postgres_handlers() -> impl Fn(tauri::Invoke) {
    tauri::generate_handler![
        crate::database_connectors::postgres::postgres_connector::connect_database,
        crate::database_connectors::postgres::data::get_table_data,

    ]
}