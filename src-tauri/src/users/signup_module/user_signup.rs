#[tauri::command]
pub async fn create_user(username: String, password: String) -> Result<String, String> {
    Ok("User created successfully".to_string())
}