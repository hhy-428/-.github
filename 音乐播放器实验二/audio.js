// 歌曲数据（完整保留）
const musicList = [
  { title: "传奇", author: "王菲", src: "./audio/传奇.aac", cover: "./img/传奇.jpg" },
  { title: "百年孤寂", author: "王菲", src: "./audio/百年孤寂.aac", cover: "./img/百年孤寂.jpg" },
  { title: "红豆", author: "王菲", src: "./audio/红豆.mp3", cover: "./img/红豆.webp" }
];

// 获取所有页面元素（完整保留）
const audioTag = document.getElementById("audioTag");
const playPauseBtn = document.getElementById("playPause");
const progressTotal = document.getElementById("progress-total");
const progressBar = document.getElementById("progress");
const playedTime = document.getElementById("playedTime");
const audioTime = document.getElementById("audioTime");
const skipForward = document.getElementById("skipForward");
const skipBackward = document.getElementById("skipBackward");
const volumeSlider = document.getElementById("volumn-togger");
const playModeBtn = document.getElementById("playMode");
const listBtn = document.getElementById("list");
const musicListDom = document.getElementById("music-list");
const closeListDom = document.getElementById("close-list");
const speedBtn = document.getElementById("speed");
const recordImg = document.getElementById("record-img");
const musicTitle = document.getElementById("music-title");
const authorName = document.getElementById("author-name");
const musicItems = document.querySelectorAll(".all-list div");

// 初始化变量（完整保留）
let currentIndex = 0;
let isPlaying = false;
let playMode = 0; // 0=列表循环 1=单曲循环 2=随机播放
const speedOptions = [0.5, 1.0, 1.5, 2.0];
let currentSpeedIndex = 1;

// 时间格式化（完整保留）
function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

// 加载歌曲（完整保留）
function loadMusic(index) {
  const music = musicList[index];
  audioTag.src = music.src;
  musicTitle.textContent = music.title;
  authorName.textContent = music.author;
  recordImg.style.backgroundImage = `url(${music.cover})`;
  audioTag.addEventListener("loadedmetadata", () => {
    audioTime.textContent = formatTime(audioTag.duration);
  }, { once: true });
}

// 播放功能（完整保留）
function playMusic() {
  audioTag.play().catch(err => console.log(err));
  isPlaying = true;
  playPauseBtn.className = "icon-pause";
  recordImg.style.animationPlayState = "running";
}

// 暂停功能（完整保留）
function pauseMusic() {
  audioTag.pause();
  isPlaying = false;
  playPauseBtn.className = "icon-play";
  recordImg.style.animationPlayState = "paused";
}

// 播放/暂停切换（完整保留）
function togglePlayPause() {
  isPlaying ? pauseMusic() : playMusic();
}

// 更新进度条（完整保留）
function updateProgress() {
  const current = audioTag.currentTime;
  const duration = audioTag.duration;
  const percent = (current / duration) * 100 || 0;
  progressBar.style.width = `${percent}%`;
  playedTime.textContent = formatTime(current);
}

// 进度条跳转（完整保留）
function jumpProgress(e) {
  const rect = progressTotal.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audioTag.currentTime = percent * audioTag.duration;
}

// 上一首（修复：适配随机模式）
function playPrev() {
  if (playMode === 2) {
    // 随机模式：直接随机切歌
    currentIndex = Math.floor(Math.random() * musicList.length);
  } else {
    // 列表/单曲模式：正常上一首
    currentIndex = (currentIndex - 1 + musicList.length) % musicList.length;
  }
  loadMusic(currentIndex);
  playMusic();
}

// 下一首（修复：适配随机模式）
function playNext() {
  if (playMode === 2) {
    // 随机模式：直接随机切歌
    currentIndex = Math.floor(Math.random() * musicList.length);
  } else {
    // 列表/单曲模式：正常下一首
    currentIndex = (currentIndex + 1) % musicList.length;
  }
  loadMusic(currentIndex);
  playMusic();
}

// 播放模式切换（修复：正确切换CSS类）
function togglePlayMode() {
  playMode = (playMode + 1) % 3;
  // 移除所有模式类
  playModeBtn.classList.remove("mode-list", "mode-single", "mode-random");
  // 添加当前模式的类
  if (playMode === 0) {
    playModeBtn.classList.add("mode-list");
  } else if (playMode === 1) {
    playModeBtn.classList.add("mode-single");
  } else if (playMode === 2) {
    playModeBtn.classList.add("mode-random");
  }
}

// 音量调节（完整保留）
function adjustVolume() {
  audioTag.volume = volumeSlider.value / 100;
}

// 列表显示隐藏（完整保留）
function toggleMusicList() {
  const isHidden = musicListDom.style.display === "none" || !musicListDom.style.display;
  musicListDom.style.display = isHidden ? "block" : "none";
  closeListDom.style.display = isHidden ? "block" : "none";
}

// 倍速切换（完整保留）
function toggleSpeed() {
  currentSpeedIndex = (currentSpeedIndex + 1) % speedOptions.length;
  const speed = speedOptions[currentSpeedIndex];
  audioTag.playbackRate = speed;
  speedBtn.textContent = `${speed}倍`;
}

// 列表点击播放（完整保留）
function playMusicByIndex(index) {
  currentIndex = index;
  loadMusic(currentIndex);
  playMusic();
  toggleMusicList();
}

// 绑定所有事件（完整保留）
function initEvents() {
  playPauseBtn.addEventListener("click", togglePlayPause);
  audioTag.addEventListener("timeupdate", updateProgress);
  progressTotal.addEventListener("click", jumpProgress);
  skipForward.addEventListener("click", playPrev);
  skipBackward.addEventListener("click", playNext);
  playModeBtn.addEventListener("click", togglePlayMode);
  volumeSlider.addEventListener("input", adjustVolume);
  listBtn.addEventListener("click", toggleMusicList);
  closeListDom.addEventListener("click", toggleMusicList);
  speedBtn.addEventListener("click", toggleSpeed);

  // 歌曲结束逻辑（修复：适配三种模式）
  audioTag.addEventListener("ended", () => {
    if (playMode === 1) {
      // 单曲循环：从头播放
      audioTag.currentTime = 0;
      playMusic();
    } else {
      // 列表/随机模式：调用下一首
      playNext();
    }
  });

  musicItems.forEach((item, index) => {
    item.addEventListener("click", () => playMusicByIndex(index));
  });
}

// 初始化（修复：默认加载列表循环样式）
function init() {
  loadMusic(currentIndex);
  initEvents();
  audioTag.volume = 0.7;
  // 默认显示列表循环图标
  playModeBtn.classList.add("mode-list");
}

window.addEventListener("DOMContentLoaded", init);