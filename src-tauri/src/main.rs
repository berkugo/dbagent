// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database_connectors;
mod users;
use users::user_handlers::user_handlers;
use database_connectors::postgres_handlers::postgres_handlers;
use database_connectors::postgres::postgres_connector::ClientState;

fn main() {
    print!("test");
    tauri::Builder::default()
        // ClientState'i başlat ve yönet
        .manage(ClientState::new())
        .invoke_handler(user_handlers())
        .invoke_handler(postgres_handlers())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
    