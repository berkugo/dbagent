
pub fn register_handlers() -> impl Fn(tauri::Invoke) {
    tauri::generate_handler![
        crate::users::signin_module::user_signin::signin,
        crate::users::signup_module::user_signup::create_user
    ]
}