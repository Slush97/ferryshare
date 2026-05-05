# Dependency Backlog

Priority order — top item is the one to do next.

## 1. `btleplug` 0.11 → 0.12
- **Why:** BLE listener for advertisement detection.
- **Risk:** majors here historically rework the adapter/event API; regressions only show with a real Bluetooth peer.
- **Validation:** Linux + macOS + Windows ideally; minimum is one BLE-advertising peer.

## Low-priority cleanup (anytime)
- **Stray files at repo root** — untracked `node_modules/`, `package.json`, `pnpm-lock.yaml` at `/home/esoc/rquickshare/`. Either add to `.gitignore` or delete.
- **`electron@^41.5.0` pnpm override** — added in `beb355e` without rationale. Likely pinning `@vue/devtools-electron`'s transitive past a CVE; worth confirming and documenting (or dropping if no longer needed).

## Done this session
- RustCrypto bundle: `sha2` 0.10 → 0.11, `hmac` 0.12 → 0.13, `hkdf` 0.12 → 0.13. Only API breakage was `new_from_slice` moving from `Mac` onto `KeyInit` — added the import in `inbound.rs` / `outbound.rs`. Validated with real-device round-trip (send + receive both directions, no `hmac!=signature`).
- Tailwind 3 → 4 (CSS-first config, dropped postcss-import / postcss-nesting / autoprefixer, `@tailwindcss/vite`, `@custom-variant dark`, `theme()` → `var()`, fonts to `<link>`) plus a paper-themed UI polish pass (wider empty-state click-target dropzone, letterhead settings header, title-bar fold shadow, diary serif italics, paper-toned toasts, calmer postmark pulse, `#app` unfold-on-open) — `97542e4`..`9a0e123`
- `postcss` 8.5.13 → 8.5.14 — `eec745a`
- `tokio` 1.52.1 → 1.52.2 (both crates) — `eec745a`
- `notify-rust` 4.16.1 → 4.17.0 — `eec745a`
- `rand` 0.9 → 0.10 (with `RngCore` → `Rng` / `RngExt` migration) — `b13d81f`
- `ts-rs` 10 → 12 (zero diff in generated bindings) — `b13d81f`
- `prost` + `prost-build` 0.13 → 0.14 (drop-in, no source changes) — `5cd30fa`
- WebKitGTK Wayland workaround baked into `main.rs` — `04525dd`
