// ===== 插入播放器样式（根据主题自动切换颜色） =====
const style = document.createElement('style');
style.textContent = `
#music-player {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%) scale(0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  font-family: sans-serif;
  border-radius: 8px;
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.5);
  color: #111;
}
.dark #music-player {
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
}
#music-player button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  transition: color 0.3s ease;
}
#music-player button:hover {
  color: #4CAF50;
}
#music-player svg {
  fill: currentColor;
  width: 20px;
  height: 20px;
}
#song-info {
  flex: 1;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}
`;
document.head.appendChild(style);

// ===== 插入播放器 DOM =====
const player = document.createElement('div');
player.id = 'music-player';
player.innerHTML = `
  <button id="prev" title="上一首">
    <svg viewBox="0 0 24 24"><path d="M16 19V5l-11 7z"/></svg>
  </button>
  <button id="play-pause" title="播放">
    <svg id="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    <svg id="pause-icon" viewBox="0 0 24 24" style="display:none;">
      <rect x="6" y="5" width="4" height="14"/>
      <rect x="14" y="5" width="4" height="14"/>
    </svg>
  </button>
  <button id="next" title="下一首">
    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
  </button>
  <span id="song-info">加载中...</span>
`;
document.body.appendChild(player);

// ===== 播放器逻辑 =====
const songs = [
  {
    "title": "黄昏 - 周传雄",
    "src": "https://music.gvrander.eu.org/music/%E9%BB%84%E6%98%8F-%E5%91%A8%E4%BC%A0%E9%9B%84.flac"
  },
  {
    "title": "가장 예쁜 별을 너에 - 마리탱",
    "src": "https://music.gvrander.eu.org/music/%EA%B0%80%EC%9E%A5%20%EC%98%88%EC%81%9C%20%EB%B3%84%EC%9D%84%20%EB%84%88%EC%97%90-%EB%A7%88%EB%A6%AC%ED%83%B1.m4a"
  }
];

let currentSongIndex = Math.floor(Math.random() * songs.length);
let audio = null;
let isPlaying = false;
let hasInteracted = false;

function updateButtons() {
  document.getElementById('play-icon').style.display = isPlaying ? 'none' : 'block';
  document.getElementById('pause-icon').style.display = isPlaying ? 'block' : 'none';
  document.getElementById('play-pause').title = isPlaying ? '暂停' : '播放';
}

function updateSongInfo() {
  document.getElementById('song-info').textContent = songs[currentSongIndex]?.title || '未知音轨';
}

function initAudio() {
  if (audio) return;
  audio = new Audio();
  audio.preload = 'auto';
  audio.addEventListener('ended', playNext);
  audio.addEventListener('play', () => {
    isPlaying = true;
    updateButtons();
  });
  audio.addEventListener('pause', () => {
    isPlaying = false;
    updateButtons();
  });
}

async function loadAndPlay(autoplay = true) {
  try {
    initAudio();
    audio.src = songs[currentSongIndex].src;
    updateSongInfo();
    if (autoplay) await audio.play();
  } catch (e) {
    console.warn('播放失败:', e);
    isPlaying = false;
    updateButtons();
    document.getElementById('song-info').textContent = '播放失败';
  }
}

function playNext() {
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * songs.length);
  } while (nextIndex === currentSongIndex && songs.length > 1);
  currentSongIndex = nextIndex;
  loadAndPlay(true);
}

function playPrev() {
  let prevIndex;
  do {
    prevIndex = Math.floor(Math.random() * songs.length);
  } while (prevIndex === currentSongIndex && songs.length > 1);
  currentSongIndex = prevIndex;
  loadAndPlay(true);
}

function togglePlay() {
  if (!audio) return;
  audio.paused ? audio.play() : audio.pause();
}

function onFirstUserInteraction() {
  if (hasInteracted) return;
  hasInteracted = true;
  window.removeEventListener('click', onFirstUserInteraction);
  window.removeEventListener('keydown', onFirstUserInteraction);
  loadAndPlay(true);
}

// ===== 用户交互事件绑定 =====
window.addEventListener('click', onFirstUserInteraction, { once: true });
window.addEventListener('keydown', onFirstUserInteraction, { once: true });

window.addEventListener('load', () => {
  initAudio();
  updateSongInfo();
  updateButtons();
});

document.getElementById('play-pause').addEventListener('click', togglePlay);
document.getElementById('next').addEventListener('click', playNext);
document.getElementById('prev').addEventListener('click', playPrev);
