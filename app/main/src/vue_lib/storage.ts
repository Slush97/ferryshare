import { getStore, Store } from '@tauri-apps/plugin-store';

let _store: Store | null = null;

export async function settingsStore(): Promise<Store> {
	if (_store) return _store;
	const s = await getStore('.settings.json');
	if (!s) throw new Error('failed to open .settings.json store');
	_store = s;
	return _store;
}
