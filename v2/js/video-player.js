const video = document.getElementById("video");
const playBtn = document.getElementById("play");
const centerPlayBtn = document.getElementById("centerPlay");
const forwardBtn = document.getElementById("forward");
const backwardBtn = document.getElementById("backward");
const progress = document.getElementById("progress");
const progressFilled = document.getElementById("progress-filled");
const timeDisplay = document.getElementById("time");
const volumeSlider = document.getElementById("volume");
const container = document.getElementById("video-container");
const controls = document.getElementById("controls");
const fullscreenBtn = document.getElementById("fullscreen");
const goBackBtn = document.getElementById("goBack");

let inactivityTimer;

// --- Go Back ---
goBackBtn.addEventListener("click", () => window.location.href = "index.html");

// --- Play/Pause ---
function togglePlay() {
  if (video.paused) {
    video.play();
    container.classList.remove("paused");
    playBtn.innerHTML = '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM9 9H11V15H9V9ZM13 9H15V15H13V9Z" fill="white"/></svg>';
    centerPlayBtn.innerHTML = '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM9 9H11V15H9V9ZM13 9H15V15H13V9Z" fill="white"/></svg>';
  } else {
    video.pause();
    container.classList.add("paused");
    playBtn.innerHTML = '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 18.3915V5.60846L18.2264 12L8 18.3915ZM6 3.80421V20.1957C6 20.9812 6.86395 21.46 7.53 21.0437L20.6432 12.848C21.2699 12.4563 21.2699 11.5436 20.6432 11.152L7.53 2.95621C6.86395 2.53993 6 3.01878 6 3.80421Z" fill="white"/></svg>';
    centerPlayBtn.innerHTML = '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 18.3915V5.60846L18.2264 12L8 18.3915ZM6 3.80421V20.1957C6 20.9812 6.86395 21.46 7.53 21.0437L20.6432 12.848C21.2699 12.4563 21.2699 11.5436 20.6432 11.152L7.53 2.95621C6.86395 2.53993 6 3.01878 6 3.80421Z" fill="white"/></svg>';
  }
}
playBtn.addEventListener("click", togglePlay);
centerPlayBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);

// --- Skip 10s ---
forwardBtn.addEventListener("click", () => (video.currentTime += 10));
backwardBtn.addEventListener("click", () => (video.currentTime -= 10));

// --- Progress Bar ---
video.addEventListener("timeupdate", () => {
  const percent = (video.currentTime / video.duration) * 100;
  progressFilled.style.width = percent + "%";
  timeDisplay.textContent = formatTime(video.currentTime) + " / " + formatTime(video.duration);
});
progress.addEventListener("click", (e) => {
  const newTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = newTime;
});

// --- Volume ---
volumeSlider.addEventListener("input", () => (video.volume = volumeSlider.value));

// --- Fullscreen ---
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) container.requestFullscreen();
  else document.exitFullscreen();
});

// --- Auto-hide overlays ---
function showOverlays() {
  container.classList.remove("overlay-hidden");
  container.style.cursor = "default";
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    if (!video.paused) {
      container.classList.add("overlay-hidden");
      container.style.cursor = "none";
    }
  }, 3000);
}

container.addEventListener("mousemove", showOverlays);
container.addEventListener("touchstart", showOverlays);
video.addEventListener("play", showOverlays);
video.addEventListener("pause", () => {
  container.classList.remove("overlay-hidden");
  container.style.cursor = "default";
});

// --- Helper ---
function formatTime(sec) {
  if (isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// --- Keyboard shortcuts ---
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  } else if (e.code === "ArrowRight") {
    video.currentTime += 10;
  } else if (e.code === "ArrowLeft") {
    video.currentTime -= 10;
  } else if (e.code === "KeyF") {
    fullscreenBtn.click();
  }
});