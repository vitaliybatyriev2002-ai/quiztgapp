#!/usr/bin/env node
/**
 * Сканирует папку music/ и генерирует music/playlist.json
 * Запуск: node build-playlist.js
 *
 * Формат имён файлов: "Исполнитель - Песня.mp3"
 */

const fs   = require('fs');
const path = require('path');

const MUSIC_DIR     = path.join(__dirname, 'music');
const PLAYLIST_FILE = path.join(MUSIC_DIR, 'playlist.json');
const EXTENSIONS    = ['.mp3', '.ogg', '.wav', '.m4a', '.flac'];

if (!fs.existsSync(MUSIC_DIR)) {
  fs.mkdirSync(MUSIC_DIR, { recursive: true });
}

const files = fs.readdirSync(MUSIC_DIR)
  .filter(f => EXTENSIONS.includes(path.extname(f).toLowerCase()))
  .sort();

const playlist = files.map(filename => {
  const name = filename.replace(/\.[^/.]+$/, '');
  const sep  = name.indexOf(' - ');
  if (sep !== -1) {
    return {
      src:    `music/${filename}`,
      artist: name.slice(0, sep).trim(),
      title:  name.slice(sep + 3).trim(),
    };
  }
  return { src: `music/${filename}`, artist: '—', title: name };
});

fs.writeFileSync(PLAYLIST_FILE, JSON.stringify(playlist, null, 2), 'utf8');

console.log(`✅ playlist.json обновлён — ${playlist.length} трек(ов):`);
playlist.forEach((t, i) => console.log(`  ${i + 1}. ${t.artist} — ${t.title}`));
