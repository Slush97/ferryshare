use std::path::PathBuf;
use tokio::fs;
use tokio::io::AsyncReadExt;

const MAX_TEXT_BYTES: u64 = 2_000_000; // 2 MB

#[tauri::command]
pub async fn read_text_file(path: String) -> Result<String, String> {
    let p = PathBuf::from(&path);

    let metadata = fs::metadata(&p).await.map_err(|e| e.to_string())?;
    if !metadata.is_file() {
        return Err("not a regular file".into());
    }
    if metadata.len() > MAX_TEXT_BYTES {
        return Err(format!(
            "file too large ({} bytes; max {})",
            metadata.len(),
            MAX_TEXT_BYTES
        ));
    }

    let mut file = fs::File::open(&p).await.map_err(|e| e.to_string())?;
    let mut buf = Vec::with_capacity(metadata.len() as usize);
    file.read_to_end(&mut buf)
        .await
        .map_err(|e| e.to_string())?;

    String::from_utf8(buf).map_err(|_| "file is not valid UTF-8".into())
}
