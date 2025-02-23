#[tauri::command]
pub async fn signin(username: String, password: String) -> Result<String, String> {


    
    Ok("Signed in successfully".to_string())
}