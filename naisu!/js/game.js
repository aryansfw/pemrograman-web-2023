/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const playButton = document.getElementById("play-button");

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

let beatmap;
// Loading audio
const audio = loadAudio(
  [
    { name: "hitsound", path: "./audio/hitsound.ogg" },
    { name: "song", path: "./audio/song.mp3" },
  ],
  initialize
);

// Beats per minute
const bpm = 260;
const beatInterval = Math.floor(1000 / (bpm / 60));

// Game variables and constants
const approachRate = 1000; // in milliseconds
const circleRadius = 50; // radius in pixels
const circleColors = ["#f5abd7", "#ffef5c", "#657eeb", "#ff6857"]; // colors
const allowedKeys = "sdjk"; // Key bindings
const hitWindow = 200; // in milliseconds
let score = 0;
let combo = 0;
let currentIndex = 0;
let accuracy = "";

// Game loop variables
let startTime;
let fps = 144;
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;

// Key buffer
let inputBuffer = [];

window.addEventListener("keydown", onKeyDown);

playButton.onclick = () => {
  audio["song"].play();
  startTime = Date.now();
  canvas.style.display = "block";
  mainMenu.style.display = "none";
  gameLoop();
};

function initialize() {
  beatmap = generateBeatmap();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Canvas background
  canvas.style.background =
    "url('./images/background.png') center/cover no-repeat";

  // Background dim
  context.fillStyle = "rgba(0, 0, 0, 0.8)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  showMenu(startMenu);
}

function main(currentTime) {
  // Set width and height for canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Canvas background
  canvas.style.background =
    "url('./images/background.png') center/cover no-repeat";

  // Background dim
  context.fillStyle = "rgba(0, 0, 0, 0.8)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Where circles are going to come and go
  let source = -circleRadius;
  let destination = canvas.height - circleRadius * 2;

  // Hit circles
  for (let i = 0; i < 4; i++) {
    drawCircleStroke(
      getCircleX(canvas.width, i),
      destination,
      circleRadius,
      circleColors[i]
    );
  }

  // Falling circles
  for (let i = 0; i < beatmap.length; i++) {
    drawCircleFill(
      getCircleX(canvas.width, beatmap[i].index),
      getCircleY(source, destination, currentTime, beatmap[i]),
      circleRadius,
      circleColors[beatmap[i].index]
    );

    if (
      currentTime > startTime + beatmap[i].time + hitWindow &&
      i >= currentIndex
    ) {
      combo = 0;
      accuracy = "miss";
      currentIndex++;
    }
  }

  // On keyboard click
  for (let i = 0; i < inputBuffer.length; i++) {
    let index = inputBuffer[i];

    // Filter out the beatmap and find the closest circle
    let beatmapFiltered = beatmap.filter((circle) => circle.index == index);

    let circle = beatmapFiltered.reduce((closest, current) => {
      return Math.abs(current.time - currentTime + startTime) <
        Math.abs(closest.time - currentTime + startTime)
        ? current
        : closest;
    });

    let difference = Math.abs(circle.time - currentTime + startTime);

    // If circle successfully hit
    if (difference < hitWindow) {
      audio["hitsound"].cloneNode().play();
      score += calculateScore(difference) * Math.max(combo, 1);
      beatmap.splice(beatmap.indexOf(circle), 1);
      combo++;
    } else {
      combo = 0;
      accuracy = "miss";
    }

    drawCircleFill(
      getCircleX(canvas.width, index),
      destination,
      circleRadius,
      circleColors[index]
    );
  }

  // HUD
  context.fillStyle = "white";

  let scoreText = score.toString().padStart(10, "0");
  let comboText = combo.toString();

  context.font = "30px Arial";
  context.textAlign = "end";
  context.fillText(scoreText, canvas.width, 30); // Score

  context.font = "42px Arial";
  context.textAlign = "center";
  context.fillText(comboText, canvas.width / 2, canvas.height / 4); // Combo

  context.font = "60px Arial";
  context.fillText(accuracy, canvas.width / 2, (canvas.height * 3) / 5); // Combo
}

/**
 *
 * @param {KeyboardEvent} event
 *
 */
function onKeyDown(event) {
  const key = event.key.toLowerCase();

  if (!allowedKeys.includes(event.key) || event.repeat == true) return;

  inputBuffer.push(allowedKeys.indexOf(key));
}

function loadAudio(audioData, handler) {
  let audioCount = audioData.length;
  const audio = {};

  audioData.forEach((data) => {
    audio[data.name] = new Audio(data.path);
    audio[data.name].oncanplaythrough = () => --audioCount == 0 && handler();
  });
  return audio;
}

// Generate beatmap randomly
function generateBeatmap() {
  let circles = [];

  for (
    let i = 0;
    i < Math.floor((audio["song"].duration * 1000) / beatInterval);
    i++
  ) {
    circles.push({
      index: Math.floor(Math.random() * 4),
      time: i * beatInterval + beatInterval * 5,
    });
  }
  return circles;
}

function drawCircleStroke(x, y, radius, color) {
  context.beginPath();

  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.lineWidth = 4;
  context.strokeStyle = color;
  context.stroke();
}

function drawCircleFill(x, y, radius, color) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
}

function getCircleX(width, index) {
  return width / 2 - circleRadius * 4 + index * circleRadius * 2.5;
}

function getCircleY(source, destination, currentTime, circle) {
  const spawnTime = startTime + circle.time - approachRate;
  if (currentTime < spawnTime) {
    return source;
  } else {
    return (
      ((currentTime - spawnTime) / approachRate) * (destination - source) +
      source
    );
  }
}

function calculateScore(hitTime) {
  let result = 0;
  if (hitTime <= hitWindow * 0.2) {
    accuracy = "300";
    result = 300;
  } else if (hitTime <= hitWindow * 0.8) {
    accuracy = "100";
    result = 100;
  } else if (hitTime <= hitWindow) {
    accuracy = "50";
    result = 50;
  }
  return result;
}

// Game loop that runs at specified FPS
function gameLoop() {
  window.requestAnimationFrame(gameLoop);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);

    main(now);

    inputBuffer = [];
  }
}
