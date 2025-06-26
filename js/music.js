// ===== 插入播放器样式 =====
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
  backdrop-filter: none;
  background: transparent;
  color: #111;
}
.dark #music-player {
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
  <img src="https://api.zha.x10.mx/api" alt="visit" style="width:0;height:0;visibility:hidden;" />
`;
document.body.appendChild(player);

// ===== 播放器逻辑 =====
const songs = [
  {
    "title": "说好的幸福呢 - 周杰伦",
    "src": "https://music.gvrander.eu.org/music/%E8%AF%B4%E5%A5%BD%E7%9A%84%E5%B9%B8%E7%A6%8F%E5%91%A2-%E5%91%A8%E6%9D%B0%E4%BC%A6.flac"
  },
  {
    "title": "借口 - 周杰伦",
    "src": "https://music.gvrander.eu.org/music/%E5%80%9F%E5%8F%A3-%E5%91%A8%E6%9D%B0%E4%BC%A6.mp3"
  },
  {
    "title": "告白气球 - 周杰伦",
    "src": "https://music.gvrander.eu.org/music/%E5%91%8A%E7%99%BD%E6%B0%94%E7%90%83-%E5%91%A8%E6%9D%B0%E4%BC%A6.flac"
  },
  {
    "title": "搁浅 - 周杰伦",
    "src": "https://music.gvrander.eu.org/music/%E6%90%81%E6%B5%85-%E5%91%A8%E6%9D%B0%E4%BC%A6.flac"
  },
  {
    "title": "明明就 - 周杰伦",
    "src": "https://music.gvrander.eu.org/music/%E6%98%8E%E6%98%8E%E5%B0%B1-%E5%91%A8%E6%9D%B0%E4%BC%A6.flac"
  },
  {
    "title": "晴天 - 周杰伦",
    "src": "https://music.gvrander.eu.org/music/%E6%99%B4%E5%A4%A9%20-%20%E5%91%A8%E6%9D%B0%E4%BC%A6.mp3"
  },
  {
    "title": "最长的电影 - 周杰伦",
    "src": "https://music.gvrander.eu.org/music/%E6%9C%80%E9%95%BF%E7%9A%84%E7%94%B5%E5%BD%B1-%E5%91%A8%E6%9D%B0%E4%BC%A6.mp3"
  },
  {
    "title": "珊瑚海 - 周杰伦&amp;梁心颐",
    "src": "https://music.gvrander.eu.org/music/%E7%8F%8A%E7%91%9A%E6%B5%B7-%E5%91%A8%E6%9D%B0%E4%BC%A6%26%E6%A2%81%E5%BF%83%E9%A2%90.flac"
  },
  {
    "title": "说好不哭 - 周杰伦with阿信",
    "src": "https://music.gvrander.eu.org/music/%E8%AF%B4%E5%A5%BD%E4%B8%8D%E5%93%AD-%E5%91%A8%E6%9D%B0%E4%BC%A6with%E9%98%BF%E4%BF%A1.flac"
  },
  {
    "title": "说好的幸福呢 - 周杰伦",
    "src": "https://music.gvrander.eu.org/music/%E8%AF%B4%E5%A5%BD%E7%9A%84%E5%B9%B8%E7%A6%8F%E5%91%A2-%E5%91%A8%E6%9D%B0%E4%BC%A6.flac"
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
