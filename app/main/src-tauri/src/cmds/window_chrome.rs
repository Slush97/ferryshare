use std::env;

#[cfg(target_os = "linux")]
fn detect_tiling_wm() -> bool {
    if env::var("HYPRLAND_INSTANCE_SIGNATURE").is_ok()
        || env::var("SWAYSOCK").is_ok()
        || env::var("WAYFIRE_CONFIG_FILE").is_ok()
        || env::var("RIVER_LAYOUT_TYPE").is_ok()
    {
        return true;
    }

    let xdg = env::var("XDG_CURRENT_DESKTOP")
        .unwrap_or_default()
        .to_lowercase();
    let session = env::var("DESKTOP_SESSION")
        .unwrap_or_default()
        .to_lowercase();
    const TILERS: &[&str] = &[
        "hyprland", "sway", "river", "niri", "i3", "bspwm", "dwm", "xmonad", "qtile", "awesome",
    ];
    TILERS
        .iter()
        .any(|t| xdg.contains(t) || session.contains(t))
}

pub fn use_custom_titlebar() -> bool {
    #[cfg(target_os = "macos")]
    {
        false
    }
    #[cfg(target_os = "linux")]
    {
        !detect_tiling_wm()
    }
    #[cfg(all(not(target_os = "macos"), not(target_os = "linux")))]
    {
        true
    }
}

#[tauri::command]
pub fn get_use_custom_titlebar() -> bool {
    use_custom_titlebar()
}
