// Default distance from object (meters)
const distance = 5;

// Elements
const video = document.getElementById("camera");
const angleEl = document.getElementById("angle");
const heightEl = document.getElementById("height");

// Open camera (rear)
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" },
  audio: false
})
.then(stream => {
  video.srcObject = stream;
})
.catch(err => {
  alert("Camera access denied or not supported.");
});

// Start orientation sensor
function startOrientationSensor() {
  if (typeof DeviceOrientationEvent === "undefined") {
    alert("Orientation sensor not supported.");
    return;
  }

  // iOS 13+ requires permission
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        } else {
          alert("Permission denied for sensors.");
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

// Handle orientation event
function handleOrientation(event) {
  const angle = event.beta; // pitch angle in degrees
  angleEl.innerText = "Angle: " + angle.toFixed(2) + " °";

  if (angle > 0) {
    const radians = angle * Math.PI / 180;
    const height = distance * Math.tan(radians);
    heightEl.innerText = "Estimated Height: " + height.toFixed(2) + " m";
  }
}

// Start sensor automatically
startOrientationSensor();
