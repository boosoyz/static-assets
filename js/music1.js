// 插入播放器样式
const style = document.createElement('style');
style。textContent = `
#music-player {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%) scale(0.8);
  transform-origin: top center;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  padding: 8px 15px;
  font-family: sans-serif;
  max-width: 90%;
  white-space: nowrap;
  color: white;
}
#music-player button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  color: white;
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
  color: white;
  user-select: none;
}
`;
document.head.appendChild(style);

// 插入播放器 HTML
const div = document.createElement('div');
div.id = 'music-player';
div.innerHTML = `
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
document.body.appendChild(div);

// 播放器播放逻辑（示例）
const songs = [
  {
    title: "Let Her Go - Passenger",
    src: "https://music.gvrander.eu.org/music/Let%20Her%20Go-Passenger.flac"
  },
  {
    title: "가장 예쁜 별을 너에 - 마리탱",
    src: "https://music.gvrander.eu.org/music/%EA%B0%80%EC%9E%A5%20%EC%98%88%EC%81%9C%20%EB%B3%84%EC%9D%84%20%EB%84%88%EC%97%90-%EB%A7%88%EB%A6%AC%ED%83%B1.m4a"
  }
];

let currentSongIndex = Math.floor(Math.random() * songs.length);
let audio = null;
let isPlaying = false;
let hasInteracted = false;

function updateButtonState() {
  document.getElementById('play-icon').style.display = isPlaying ? 'none' : 'block';
  document.getElementById('pause-icon').style.display = isPlaying ? 'block' : 'none';
  document.getElementById('play-pause').title = isPlaying ? '暂停' : '播放';
}

function updateSongInfo() {
  document.getElementById('song-info').textContent = songs[currentSongIndex]?.title || '未知音轨';
}

function initAudio() {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
    audio.addEventListener('ended', () => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === currentSongIndex && songs.length > 1);
      currentSongIndex = nextIndex;
      loadAndPlay(true);
    });
    audio.addEventListener('play', () => { isPlaying = true; updateButtonState(); });
    audio.addEventListener('pause', () => { isPlaying = false; updateButtonState(); });
  }
}

async function loadAndPlay(autoplay = true) {
  try {
    initAudio();
    if (audio.src !== songs[currentSongIndex].src) {
      audio.src = songs[currentSongIndex].src;
      await new Promise((resolve, reject) => {
        audio.addEventListener('loadedmetadata', resolve, { once: true });
        audio.addEventListener('error', reject, { once: true });
      });
    }
    updateSongInfo();
    if (autoplay) await audio.play();
  } catch (err) {
    console.log("播放失败:", err);
    isPlaying = false;
    updateButtonState();
    document.getElementById('song-info').textContent = '播放失败，换首试试';
  }
}

async function togglePlayPause() {
  if (!audio) return;
  try {
    audio.paused ? await audio.play() : audio.pause();
  } catch (err) {
    console.log("播放控制失败:", err);
  }
}

function playOnFirstInteraction() {
  if (hasInteracted) return;
  hasInteracted = true;
  window.removeEventListener('click', playOnFirstInteraction);
  window.removeEventListener('keydown', playOnFirstInteraction);
  loadAndPlay(true);
}

window.addEventListener('click', playOnFirstInteraction, { once: true });
window.addEventListener('keydown', playOnFirstInteraction, { once: true });

window.addEventListener('load', () => {
  initAudio();
  updateSongInfo();
  updateButtonState();
});

document.getElementById("play-pause").addEventListener("click", togglePlayPause);
document.getElementById("next").addEventListener("click", async () => {
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * songs.length);
  } while (nextIndex === currentSongIndex && songs.length > 1);
  currentSongIndex = nextIndex;
  await loadAndPlay(true);
});
document.getElementById("prev").addEventListener("click", async () => {
  let prevIndex;
  do {
    prevIndex = Math.floor(Math.random() * songs.length);
  } while (prevIndex === currentSongIndex && songs.length > 1);
  currentSongIndex = prevIndex;
  await loadAndPlay(true);
});
