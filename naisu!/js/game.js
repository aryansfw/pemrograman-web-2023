import { Circle } from "./objects/Circle.js";

const canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

let data = [
  {
    alt: "circle",
    path: "./images/hitcircle.png",
  },
  {
    alt: "overlay",
    path: "./images/hitcircleoverlay.png",
  },
  {
    alt: "approach",
    path: "./images/approachcircle.png",
  },
];

let imageCount = data.length;

const images = {};

data.forEach((image) => {
  images[image.alt] = new Image();
  images[image.alt].src = image.path;
  images[image.alt].onload = () => --imageCount === 0 && animate();
});

const approachRate = 20000;
const circleSize = 200;
const hitsound = new Audio("./audio/hitsound.ogg");

let mouseX = 0;
let mouseY = 0;
window.addEventListener("mousemove", (e) => {
  mouseX = e.pageX;
  mouseY = e.pageY;
});

window.addEventListener("keydown", onKeyDown);

const startTime = Date.now();
let fps = 60;
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;

const circleData = [
  {
    color: "rgba(20, 189, 235, 1)",
    time: 0,
    x: 1000,
    y: 400,
  },
  // {
  //   color: "rgba(20, 189, 235, 1)",
  //   time: 600,
  //   x: 1050,
  //   y: 400,
  // },
  // {
  //   color: "rgba(20, 189, 235, 1)",
  //   time: 700,
  //   x: 1100,
  //   y: 400,
  // },
];

const circles = [];

function animate() {
  window.requestAnimationFrame(animate);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.background =
      "url('./images/background.png') center/cover no-repeat";

    ctx.globalCompositeOperation = "source-over";

    circleData.forEach((data) => {
      if (now - startTime >= data.time) {
        circles.push(
          new Circle(
            images["circle"],
            images["overlay"],
            images["approach"],
            data.color,
            data.time,
            approachRate,
            circleSize,
            data.x,
            data.y
          )
        );
        circleData.shift();
        console.log(canvas.toDataURL());
      }
    });

    circles.forEach((circle) => {
      if (now - circle.getCreated() > circle.getAliveTime()) {
        circles.splice(circles.indexOf(circle), 1);
      }

      circle.draw(ctx);
    });

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function onKeyDown() {
  // Check if mouse is inside first circle in queue

  const circle = circles[0];

  if (circle) {
    const { x, y } = circle.getPosition();
    const cx = x - circle.getSize() / 4;
    const cy = y - circle.getSize() / 4;

    const isIntersect =
      Math.sqrt((mouseX - cx) * (mouseX - cx) + (mouseY - cy) * (mouseY - cy)) <
      circle.getSize() / 2;

    if (isIntersect) {
      hitsound.play();
      circles.shift();
    }
  }
}
