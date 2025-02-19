// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database_connectors;
mod users;
use users::user_handlers::register_handlers;


fn main() {

    tauri::Builder::default()
    .invoke_handler(register_handlers())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
    