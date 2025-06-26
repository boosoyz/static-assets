(() => {
  // 插入样式
  const style = document.createElement('style');
  style.textContent = `
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

  // 播放器逻辑（简化版）
  const songs = [
    { title: "Let Her Go - Passenger", src: "https://music.gvrander.eu.org/music/Let%20Her%20Go-Passenger.flac" },
    { title: "가장 예쁜 별을 너에 - 마리탱", src: "https://music.gvrander.eu.org/music/%EA%B0%80%EC%9E%A5%20%EC%98%88%EC%81%9C%20%EB%B3%84%EC%9D%84%20%EB%84%88%EC%97%90-%EB%A7%88%EB%A6%AC%ED%83%B1.m4a" }
  ];
  let currentSongIndex = Math.floor(Math.random() * songs.length);
  let audio = new Audio();
  let isPlaying = false;

  function updateButtonState() {
    document.getElementById('play-icon').style.display = isPlaying ? 'none' : 'block';
    document.getElementById('pause-icon').style.display = isPlaying ? 'block' : 'none';
    document.getElementById('play-pause').title = isPlaying ? '暂停' : '播放';
  }

  function updateSongInfo() {
    document.getElementById('song-info').textContent = songs[currentSongIndex].title;
  }

  async function loadAndPlay() {
    audio.src = songs[currentSongIndex].src;
    try {
      await audio.play();
      isPlaying = true;
      updateButtonState();
      updateSongInfo();
    } catch(e) {
      console.error('播放失败', e);
      isPlaying = false;
      updateButtonState();
      document.getElementById('song-info').textContent = '播放失败';
    }
  }

  function togglePlayPause() {
    if (audio.paused) {
      audio.play();
      isPlaying = true;
    } else {
      audio.pause();
      isPlaying = false;
    }
    updateButtonState();
  }

  document.getElementById('play-pause').addEventListener('click', togglePlayPause);
  document.getElementById('next').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadAndPlay();
  });
  document.getElementById('prev').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadAndPlay();
  });

  audio.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadAndPlay();
  });

  // 初始加载
  loadAndPlay();
})();
