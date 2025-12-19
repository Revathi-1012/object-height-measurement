// Approximate distance in meters
const distance = 3;
const eyeHeight = 1.5;

// Elements
const video = document.getElementById("camera");
const angleEl = document.getElementById("angle");
const distanceEl = document.getElementById("distance");
const heightEl = document.getElementById("height");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

// Set canvas size same as video
function resizeCanvas() {
  canvas.width = video.videoWidth || 320;
  canvas.height = video.videoHeight || 240;
}
video.addEventListener('loadedmetadata', resizeCanvas);

// Open rear camera
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" },
  audio: false
})
.then(stream => {
  video.srcObject = stream;
})
.catch(err => alert("Camera access denied or not supported."));

// Display approximate distance
distanceEl.innerText = "Distance: " + distance + " m";

// Orientation sensor
function startOrientationSensor() {
  if (typeof DeviceOrientationEvent === "undefined") {
    alert("Orientation sensor not supported.");
    return;
  }

  window.addEventListener("deviceorientation", handleOrientation);
}

function handleOrientation(event) {
  const angle = event.beta; // tilt angle in degrees
  angleEl.innerText = "Angle: " + angle.toFixed(2) + " °";

  if (angle > 0) {
    const radians = angle * Math.PI / 180;
    let height = distance * Math.tan(radians) + eyeHeight;

    // Display height
    if (height < 1) {
      heightEl.innerText = "Height: " + (height * 100).toFixed(1) + " cm";
    } else {
      heightEl.innerText = "Height: " + height.toFixed(2) + " m";
    }

    drawLine(angle);
  }
}

// Draw a line overlay from bottom center to top based on tilt angle
function drawLine(angle) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const bottomY = canvas.height; 

  // Calculate line length proportionally
  const length = Math.min(canvas.height, distance * 50); // scale factor for visualization

  // Top point based on tilt angle
  const topY = bottomY - length * Math.tan(angle * Math.PI / 180);

  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, bottomY);
  ctx.lineTo(centerX, topY);
  ctx.stroke();
}

// Start sensor automatically
startOrientationSensor();
