// Default distance from object (meters)
const distance = 5;

// Elements
const angleEl = document.getElementById("angle");
const heightEl = document.getElementById("height");
const distanceEl = document.getElementById("distance");

// Display distance
distanceEl.innerText = distance;

// Check sensor support and request permission (iOS)
function startOrientationSensor() {
  if (typeof DeviceOrientationEvent === "undefined") {
    alert("Orientation sensor not supported on this device.");
    return;
  }

  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        } else {
          alert("Permission denied.");
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

// Handle orientation
function handleOrientation(event) {
  const angle = event.beta; // pitch angle in degrees
  angleEl.innerText = "Angle: " + angle.toFixed(2) + " °";

  if (angle > 0) {
    const radians = angle * Math.PI / 180;
    const height = distance * Math.tan(radians);
    heightEl.innerText = "Estimated Height: " + height.toFixed(2) + " m";
  }
}

// Start sensor
startOrientationSensor();
