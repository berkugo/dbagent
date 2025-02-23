// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database_connectors;
mod users;
use users::user_handlers::user_handlers;
use database_connectors::connector_handlers::connector_handlers;

fn main() {

    tauri::Builder::default()
    .invoke_handler(user_handlers())
    .invoke_handler(connector_handlers())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
    