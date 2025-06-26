// ===== 插入播放器样式 =====
const style = document.createElement('style');
style。textContent = `
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
`;
document.body.appendChild(player);

// ===== 播放器逻辑 =====
const songs = [
  {
    "title": "借口 - 周杰伦",
    "src": "https://music.gvrander.eu.org/music/%E5%80%9F%E5%8F%A3-%E5%91%A8%E6%9D%B0%E4%BC%A6.mp3"
  },
  {
    "title": "愿得一人心 - 李行亮",
    "src": "https://music.gvrander.eu.org/music/%E6%84%BF%E5%BE%97%E4%B8%80%E4%BA%BA%E5%BF%83-%E6%9D%8E%E8%A1%8C%E4%BA%AE.flac"
  },
  {
    "title": "慢慢喜欢你 - 莫文蔚",
    "src": "https://music.gvrander.eu.org/music/%E6%85%A2%E6%85%A2%E5%96%9C%E6%AC%A2%E4%BD%A0-%E8%8E%AB%E6%96%87%E8%94%9A.mp3"
  },
  {
    "title": "成都 - 赵雷",
    "src": "https://music.gvrander.eu.org/music/%E6%88%90%E9%83%BD-%E8%B5%B5%E9%9B%B7.mp3"
  },
  {
    "title": "我好喜欢你 - 六哲",
    "src": "https://music.gvrander.eu.org/music/%E6%88%91%E5%A5%BD%E5%96%9C%E6%AC%A2%E4%BD%A0-%E5%85%AD%E5%93%B2.flac"
  },
  {
    "title": "我想你了 - 海来阿木",
    "src": "https://music.gvrander.eu.org/music/%E6%88%91%E6%83%B3%E4%BD%A0%E4%BA%86-%E6%B5%B7%E6%9D%A5%E9%98%BF%E6%9C%A8.mp3"
  },
  {
    "title": "我曾 - 隔壁老樊",
    "src": "https://music.gvrander.eu.org/music/%E6%88%91%E6%9B%BE-%E9%9A%94%E5%A3%81%E8%80%81%E6%A8%8A.mp3"
  },
  {
    "title": "我爱你不问归期 - 白小白",
    "src": "https://music.gvrander.eu.org/music/%E6%88%91%E7%88%B1%E4%BD%A0%E4%B8%8D%E9%97%AE%E5%BD%92%E6%9C%9F-%E7%99%BD%E5%B0%8F%E7%99%BD.flac"
  },
  {
    "title": "披着羊皮的狼 - 刀郎",
    "src": "https://music.gvrander.eu.org/music/%E6%8A%AB%E7%9D%80%E7%BE%8A%E7%9A%AE%E7%9A%84%E7%8B%BC-%E5%88%80%E9%83%8E.flac"
  },
  {
    "title": "搀扶 - 马健涛",
    "src": "https://music.gvrander.eu.org/music/%E6%90%80%E6%89%B6-%E9%A9%AC%E5%81%A5%E6%B6%9B.mp3"
  },
  {
    "title": "搁浅 - 周杰伦",
    "src": "https://music.gvrander.eu.org/music/%E6%90%81%E6%B5%85-%E5%91%A8%E6%9D%B0%E4%BC%A6.flac"
  },
  {
    "title": "故事还长 - 云汐",
    "src": "https://music.gvrander.eu.org/music/%E6%95%85%E4%BA%8B%E8%BF%98%E9%95%BF-%E4%BA%91%E6%B1%90.wav"
  },
  {
    "title": "新娘不是我 - 程响",
    "src": "https://music.gvrander.eu.org/music/%E6%96%B0%E5%A8%98%E4%B8%8D%E6%98%AF%E6%88%91-%E7%A8%8B%E5%93%8D.mp3"
  },
  {
    "title": "方圆几里 - 薛之谦",
    "src": "https://music.gvrander.eu.org/music/%E6%96%B9%E5%9C%86%E5%87%A0%E9%87%8C-%E8%96%9B%E4%B9%8B%E8%B0%A6.mp3"
  },
  {
    "title": "无人之岛 - 任然",
    "src": "https://music.gvrander.eu.org/music/%E6%97%A0%E4%BA%BA%E4%B9%8B%E5%B2%9B-%E4%BB%BB%E7%84%B6.mp3"
  },
  {
    "title": "无名的人 - 毛不易",
    "src": "https://music.gvrander.eu.org/music/%E6%97%A0%E5%90%8D%E7%9A%84%E4%BA%BA-%E6%AF%9B%E4%B8%8D%E6%98%93.mp3"
  },
  {
    "title": "时光洪流 - 程响",
    "src": "https://music.gvrander.eu.org/music/%E6%97%B6%E5%85%89%E6%B4%AA%E6%B5%81-%E7%A8%8B%E5%93%8D.flac"
  },
  {
    "title": "明天,你好 - 牛奶咖啡",
    "src": "https://music.gvrander.eu.org/music/%E6%98%8E%E5%A4%A9%2C%E4%BD%A0%E5%A5%BD-%E7%89%9B%E5%A5%B6%E5%92%96%E5%95%A1.flac"
  },
  {
    "title": "明明就 - 周杰伦",
    "src": "https://music.gvrander.eu.org/music/%E6%98%8E%E6%98%8E%E5%B0%B1-%E5%91%A8%E6%9D%B0%E4%BC%A6.flac"
  },
  {
    "title": "星辰大海 - 黄霄雲",
    "src": "https://music.gvrander.eu.org/music/%E6%98%9F%E8%BE%B0%E5%A4%A7%E6%B5%B7-%E9%BB%84%E9%9C%84%E9%9B%B2.mp3"
  },
  {
    "title": "晚风告白 - 星野",
    "src": "https://music.gvrander.eu.org/music/%E6%99%9A%E9%A3%8E%E5%91%8A%E7%99%BD%20-%20%E6%98%9F%E9%87%8E.wav"
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
    "title": "桃花诺 - G.E.M.邓紫棋",
    "src": "https://music.gvrander.eu.org/music/%E6%A1%83%E8%8A%B1%E8%AF%BA-G.E.M.%E9%82%93%E7%B4%AB%E6%A3%8B.flac"
  },
  {
    "title": "水星记 - 郭顶",
    "src": "https://music.gvrander.eu.org/music/%E6%B0%B4%E6%98%9F%E8%AE%B0-%E9%83%AD%E9%A1%B6.mp3"
  },
  {
    "title": "永不失联的爱 - Eric周兴哲",
    "src": "https://music.gvrander.eu.org/music/%E6%B0%B8%E4%B8%8D%E5%A4%B1%E8%81%94%E7%9A%84%E7%88%B1-Eric%E5%91%A8%E5%85%B4%E5%93%B2.mp3"
  },
  {
    "title": "海阔天空 - Beyond",
    "src": "https://music.gvrander.eu.org/music/%E6%B5%B7%E9%98%94%E5%A4%A9%E7%A9%BA-Beyond.mp3"
  },
  {
    "title": "满天星辰不及你 - ycccc",
    "src": "https://music.gvrander.eu.org/music/%E6%BB%A1%E5%A4%A9%E6%98%9F%E8%BE%B0%E4%B8%8D%E5%8F%8A%E4%BD%A0%20-%20ycccc.mp3"
  },
  {
    "title": "演员 - 薛之谦",
    "src": "https://music.gvrander.eu.org/music/%E6%BC%94%E5%91%98-%E8%96%9B%E4%B9%8B%E8%B0%A6.mp3"
  },
  {
    "title": "爱就一个字 - 张信哲",
    "src": "https://music.gvrander.eu.org/music/%E7%88%B1%E5%B0%B1%E4%B8%80%E4%B8%AA%E5%AD%97-%E5%BC%A0%E4%BF%A1%E5%93%B2.mp3"
  },
  {
    "title": "爱笑的眼睛 - 林俊杰",
    "src": "https://music.gvrander.eu.org/music/%E7%88%B1%E7%AC%91%E7%9A%84%E7%9C%BC%E7%9D%9B-%E6%9E%97%E4%BF%8A%E6%9D%B0.mp3"
  },
  {
    "title": "独家记忆 - 陈小春",
    "src": "https://music.gvrander.eu.org/music/%E7%8B%AC%E5%AE%B6%E8%AE%B0%E5%BF%86-%E9%99%88%E5%B0%8F%E6%98%A5.mp3"
  },
  {
    "title": "珊瑚海 - 周杰伦&amp;梁心颐",
    "src": "https://music.gvrander.eu.org/music/%E7%8F%8A%E7%91%9A%E6%B5%B7-%E5%91%A8%E6%9D%B0%E4%BC%A6%26%E6%A2%81%E5%BF%83%E9%A2%90.flac"
  },
  {
    "title": "用力活着 - 张茜",
    "src": "https://music.gvrander.eu.org/music/%E7%94%A8%E5%8A%9B%E6%B4%BB%E7%9D%80-%E5%BC%A0%E8%8C%9C.mp3"
  },
  {
    "title": "白月光与朱砂痣 - 大籽",
    "src": "https://music.gvrander.eu.org/music/%E7%99%BD%E6%9C%88%E5%85%89%E4%B8%8E%E6%9C%B1%E7%A0%82%E7%97%A3-%E5%A4%A7%E7%B1%BD.mp3"
  },
  {
    "title": "直到遇见了你,我只喜欢你 - 陈柯宇",
    "src": "https://music.gvrander.eu.org/music/%E7%9B%B4%E5%88%B0%E9%81%87%E8%A7%81%E4%BA%86%E4%BD%A0%2C%E6%88%91%E5%8F%AA%E5%96%9C%E6%AC%A2%E4%BD%A0-%E9%99%88%E6%9F%AF%E5%AE%87.mp3"
  },
  {
    "title": "相思赋 - 张含韵",
    "src": "https://music.gvrander.eu.org/music/%E7%9B%B8%E6%80%9D%E8%B5%8B-%E5%BC%A0%E5%90%AB%E9%9F%B5.mp3"
  },
  {
    "title": "相思遥 - 玉惠同学",
    "src": "https://music.gvrander.eu.org/music/%E7%9B%B8%E6%80%9D%E9%81%A5-%E7%8E%89%E6%83%A0%E5%90%8C%E5%AD%A6.mp3"
  },
  {
    "title": "短发 - 清唯",
    "src": "https://music.gvrander.eu.org/music/%E7%9F%AD%E5%8F%91-%E6%B8%85%E5%94%AF.mp3"
  },
  {
    "title": "突然好想你 - 五月天",
    "src": "https://music.gvrander.eu.org/music/%E7%AA%81%E7%84%B6%E5%A5%BD%E6%83%B3%E4%BD%A0%20-%20%E4%BA%94%E6%9C%88%E5%A4%A9.mp3"
  },
  {
    "title": "童话 - 光良",
    "src": "https://music.gvrander.eu.org/music/%E7%AB%A5%E8%AF%9D-%E5%85%89%E8%89%AF.flac"
  },
  {
    "title": "笑纳 - 花僮",
    "src": "https://music.gvrander.eu.org/music/%E7%AC%91%E7%BA%B3-%E8%8A%B1%E5%83%AE.wav"
  },
  {
    "title": "第一次 - 光良",
    "src": "https://music.gvrander.eu.org/music/%E7%AC%AC%E4%B8%80%E6%AC%A1-%E5%85%89%E8%89%AF.mp3"
  },
  {
    "title": "等你归来 - 程响",
    "src": "https://music.gvrander.eu.org/music/%E7%AD%89%E4%BD%A0%E5%BD%92%E6%9D%A5-%E7%A8%8B%E5%93%8D.mp3"
  },
  {
    "title": "缘分一道桥 - 王力宏",
    "src": "https://music.gvrander.eu.org/music/%E7%BC%98%E5%88%86%E4%B8%80%E9%81%93%E6%A1%A5-%E7%8E%8B%E5%8A%9B%E5%AE%8F.mp3"
  },
  {
    "title": "罗刹海市 - 刀郎",
    "src": "https://music.gvrander.eu.org/music/%E7%BD%97%E5%88%B9%E6%B5%B7%E5%B8%82-%E5%88%80%E9%83%8E.mp3"
  },
  {
    "title": "美人鱼 - 林俊杰",
    "src": "https://music.gvrander.eu.org/music/%E7%BE%8E%E4%BA%BA%E9%B1%BC%20-%20%E6%9E%97%E4%BF%8A%E6%9D%B0.wav"
  },
  {
    "title": "若月亮没还没来 - 王宇宙Leto 乔浚丞",
    "src": "https://music.gvrander.eu.org/music/%E8%8B%A5%E6%9C%88%E4%BA%AE%E6%B2%A1%E8%BF%98%E6%B2%A1%E6%9D%A5-%E7%8E%8B%E5%AE%87%E5%AE%99Leto%20%E4%B9%94%E6%B5%9A%E4%B8%9E.mp3"
  },
  {
    "title": "西楼儿女 - 海来阿木",
    "src": "https://music.gvrander.eu.org/music/%E8%A5%BF%E6%A5%BC%E5%84%BF%E5%A5%B3-%E6%B5%B7%E6%9D%A5%E9%98%BF%E6%9C%A8.flac"
  },
  {
    "title": "说好的幸福呢 - 周杰伦",
    "src": "https://music.gvrander.eu.org/music/%E8%AF%B4%E5%A5%BD%E7%9A%84%E5%B9%B8%E7%A6%8F%E5%91%A2-%E5%91%A8%E6%9D%B0%E4%BC%A6.flac"
  },
  {
    "title": "说散就散 - 袁娅维TIA RAY",
    "src": "https://music.gvrander.eu.org/music/%E8%AF%B4%E6%95%A3%E5%B0%B1%E6%95%A3-%E8%A2%81%E5%A8%85%E7%BB%B4TIA%20RAY.mp3"
  },
  {
    "title": "说谎 - 林宥嘉",
    "src": "https://music.gvrander.eu.org/music/%E8%AF%B4%E8%B0%8E-%E6%9E%97%E5%AE%A5%E5%98%89.mp3"
  },
  {
    "title": "诺言 - 海来阿木",
    "src": "https://music.gvrander.eu.org/music/%E8%AF%BA%E8%A8%80-%E6%B5%B7%E6%9D%A5%E9%98%BF%E6%9C%A8.mp3"
  },
  {
    "title": "诺言 - 郭有才",
    "src": "https://music.gvrander.eu.org/music/%E8%AF%BA%E8%A8%80-%E9%83%AD%E6%9C%89%E6%89%8D.mp3"
  },
  {
    "title": "起风了 - 吴青峰",
    "src": "https://music.gvrander.eu.org/music/%E8%B5%B7%E9%A3%8E%E4%BA%86%20-%20%E5%90%B4%E9%9D%92%E5%B3%B0.wav"
  },
  {
    "title": "起风了 - 买辣椒也用券",
    "src": "https://music.gvrander.eu.org/music/%E8%B5%B7%E9%A3%8E%E4%BA%86-%E4%B9%B0%E8%BE%A3%E6%A4%92%E4%B9%9F%E7%94%A8%E5%88%B8.mp3"
  },
  {
    "title": "跳楼机 - LBI利比",
    "src": "https://music.gvrander.eu.org/music/%E8%B7%B3%E6%A5%BC%E6%9C%BA-LBI%E5%88%A9%E6%AF%94.mp3"
  },
  {
    "title": "过路的晚风 - 海来阿木",
    "src": "https://music.gvrander.eu.org/music/%E8%BF%87%E8%B7%AF%E7%9A%84%E6%99%9A%E9%A3%8E-%E6%B5%B7%E6%9D%A5%E9%98%BF%E6%9C%A8.mp3"
  },
  {
    "title": "这世界那么多人 - 莫文蔚",
    "src": "https://music.gvrander.eu.org/music/%E8%BF%99%E4%B8%96%E7%95%8C%E9%82%A3%E4%B9%88%E5%A4%9A%E4%BA%BA-%E8%8E%AB%E6%96%87%E8%94%9A.mp3"
  },
  {
    "title": "这就是爱吗 - 十豆彡",
    "src": "https://music.gvrander.eu.org/music/%E8%BF%99%E5%B0%B1%E6%98%AF%E7%88%B1%E5%90%97-%E5%8D%81%E8%B1%86%E5%BD%A1.mp3"
  },
  {
    "title": "迟来的爱 - 金润吉",
    "src": "https://music.gvrander.eu.org/music/%E8%BF%9F%E6%9D%A5%E7%9A%84%E7%88%B1-%E9%87%91%E6%B6%A6%E5%90%89.mp3"
  },
  {
    "title": "追光者 - 岑宁儿",
    "src": "https://music.gvrander.eu.org/music/%E8%BF%BD%E5%85%89%E8%80%85-%E5%B2%91%E5%AE%81%E5%84%BF.mp3"
  },
  {
    "title": "送亲 - 王琪",
    "src": "https://music.gvrander.eu.org/music/%E9%80%81%E4%BA%B2-%E7%8E%8B%E7%90%AA.mp3"
  },
  {
    "title": "遇见 - 孙燕姿",
    "src": "https://music.gvrander.eu.org/music/%E9%81%87%E8%A7%81-%E5%AD%99%E7%87%95%E5%A7%BF.flac"
  },
  {
    "title": "那些你很冒险的梦 - 林俊杰",
    "src": "https://music.gvrander.eu.org/music/%E9%82%A3%E4%BA%9B%E4%BD%A0%E5%BE%88%E5%86%92%E9%99%A9%E7%9A%84%E6%A2%A6-%E6%9E%97%E4%BF%8A%E6%9D%B0.flac"
  },
  {
    "title": "那女孩对我说 - 小阿七",
    "src": "https://music.gvrander.eu.org/music/%E9%82%A3%E5%A5%B3%E5%AD%A9%E5%AF%B9%E6%88%91%E8%AF%B4-%E5%B0%8F%E9%98%BF%E4%B8%83.mp3"
  },
  {
    "title": "那就这样吧 - 动力火车",
    "src": "https://music.gvrander.eu.org/music/%E9%82%A3%E5%B0%B1%E8%BF%99%E6%A0%B7%E5%90%A7-%E5%8A%A8%E5%8A%9B%E7%81%AB%E8%BD%A6.flac"
  },
  {
    "title": "错位时空 - 艾辰",
    "src": "https://music.gvrander.eu.org/music/%E9%94%99%E4%BD%8D%E6%97%B6%E7%A9%BA-%E8%89%BE%E8%BE%B0.flac"
  },
  {
    "title": "飞鸟和蝉 - 任然",
    "src": "https://music.gvrander.eu.org/music/%E9%A3%9E%E9%B8%9F%E5%92%8C%E8%9D%89-%E4%BB%BB%E7%84%B6.mp3"
  },
  {
    "title": "魔鬼中的天使 - 田馥甄",
    "src": "https://music.gvrander.eu.org/music/%E9%AD%94%E9%AC%BC%E4%B8%AD%E7%9A%84%E5%A4%A9%E4%BD%BF-%E7%94%B0%E9%A6%A5%E7%94%84.mp3"
  },
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
