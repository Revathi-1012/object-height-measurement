let currentAngle = 0;
let baseAngle = null;
let topAngle = null;

// Button references
const baseBtn = document.getElementById("baseBtn");
const topBtn = document.getElementById("topBtn");

// Request sensor permission & start listening
function startSensor() {
  if (typeof DeviceOrientationEvent === "undefined") {
    alert("Orientation sensor not supported");
    return;
  }

  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", readOrientation);
        } else {
          alert("Permission denied");
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener("deviceorientation", readOrientation);
  }
}

// Read orientation angle
function readOrientation(event) {
  currentAngle = event.beta;
}

// Capture base angle
baseBtn.addEventListener("click", () => {
  startSensor();
  baseAngle = currentAngle;
  document.getElementById("baseAngle").innerText =
    "Base Angle: " + baseAngle.toFixed(2) + "°";
});

// Capture top angle and calculate height
topBtn.addEventListener("click", () => {
  startSensor();
  topAngle = currentAngle;
  document.getElementById("topAngle").innerText =
    "Top Angle: " + topAngle.toFixed(2) + "°";

  calculateHeight();
});

// Height calculation using sensor model
function calculateHeight() {
  const distance = parseFloat(document.getElementById("distance").value);

  if (isNaN(distance) || baseAngle === null || topAngle === null) {
    alert("Please set distance, base angle, and top angle");
    return;
  }

  const baseRad = baseAngle * Math.PI / 180;
  const topRad = topAngle * Math.PI / 180;

  const height = distance * (Math.tan(topRad) - Math.tan(baseRad));

  document.getElementById("height").innerText =
    "Height: " + height.toFixed(2) + " meters";
}
