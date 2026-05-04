use std::path::PathBuf;

const URL_SCHEMES: &[&str] = &["http://", "https://", "mailto:", "tel:", "ftp://", "file://"];

#[tauri::command]
pub fn open_path(path: String) -> Result<(), String> {
    let is_url = URL_SCHEMES.iter().any(|s| path.starts_with(s));
    if !is_url {
        let p = PathBuf::from(&path);
        if !p.exists() {
            return Err(format!("path does not exist: {path}"));
        }
    }
    open::that_detached(&path).map_err(|e| e.to_string())
}
