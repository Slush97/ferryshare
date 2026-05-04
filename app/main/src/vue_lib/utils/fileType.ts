export type FileKind =
	| 'image'
	| 'video'
	| 'audio'
	| 'pdf'
	| 'text'
	| 'archive'
	| 'unknown';

const IMAGE_EXT = new Set([
	'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'avif', 'ico',
]);
const VIDEO_EXT = new Set([
	'mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v', 'ogv',
]);
const AUDIO_EXT = new Set([
	'mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'opus', 'wma',
]);
const PDF_EXT = new Set(['pdf']);
const ARCHIVE_EXT = new Set([
	'zip', '7z', 'rar', 'tar', 'gz', 'bz2', 'xz', 'tgz',
]);
const TEXT_EXT = new Set([
	// generic text
	'txt', 'md', 'log', 'rtf',
	// data
	'json', 'yaml', 'yml', 'toml', 'csv', 'tsv', 'xml', 'ini', 'conf',
	// web
	'html', 'htm', 'css', 'scss', 'sass', 'less', 'postcss',
	// JS/TS
	'js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'vue', 'svelte', 'astro',
	// systems
	'rs', 'go', 'c', 'cpp', 'cc', 'cxx', 'h', 'hpp', 'hh',
	// jvm / .net
	'java', 'kt', 'kts', 'scala', 'groovy', 'cs', 'fs', 'vb',
	// scripting
	'py', 'rb', 'php', 'pl', 'lua', 'r', 'sh', 'bash', 'zsh', 'fish',
	// other languages
	'swift', 'dart', 'ex', 'exs', 'erl', 'hs', 'clj', 'cljs',
	// data / query
	'sql', 'graphql', 'gql', 'proto',
	// misc
	'env', 'gitignore', 'editorconfig', 'dockerfile', 'makefile',
]);

export function getExtension(path: string): string {
	const name = path.split(/[\\/]/).pop() ?? '';
	const idx = name.lastIndexOf('.');
	return idx >= 0 ? name.slice(idx + 1).toLowerCase() : name.toLowerCase();
}

export function fileKind(path: string): FileKind {
	const ext = getExtension(path);
	if (IMAGE_EXT.has(ext)) return 'image';
	if (VIDEO_EXT.has(ext)) return 'video';
	if (AUDIO_EXT.has(ext)) return 'audio';
	if (PDF_EXT.has(ext)) return 'pdf';
	if (TEXT_EXT.has(ext)) return 'text';
	if (ARCHIVE_EXT.has(ext)) return 'archive';
	return 'unknown';
}

export function isPreviewable(path: string): boolean {
	const k = fileKind(path);
	return k === 'image' || k === 'video' || k === 'audio' || k === 'pdf' || k === 'text';
}

export function joinPath(dir: string, name: string): string {
	const sep = dir.includes('\\') && !dir.includes('/') ? '\\' : '/';
	return dir.endsWith(sep) ? `${dir}${name}` : `${dir}${sep}${name}`;
}
