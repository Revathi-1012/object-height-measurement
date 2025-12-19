let angle = 0;

// Button reference
const startBtn = document.getElementById("startBtn");

// Button click event
startBtn.addEventListener("click", startMeasurement);

// Function to start sensor measurement
function startMeasurement() {

  // Check device support
  if (typeof DeviceOrientationEvent === "undefined") {
    alert("Orientation sensor not supported on this device");
    return;
  }

  // iOS permission request
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission()
      .then(permission => {
        if (permission === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        } else {
          alert("Permission denied");
        }
      })
      .catch(error => {
        console.error(error);
      });
  } 
  // Android & others
  else {
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

// Function to read orientation and calculate height
function handleOrientation(event) {

  // Pitch angle (tilt)
  angle = event.beta;

  document.getElementById("angle").innerText =
    "Angle: " + angle.toFixed(2) + "°";

  // Read distance
  const distanceInput = document.getElementById("distance").value;
  const distance = parseFloat(distanceInput);

  // Validation
  if (isNaN(distance) || distance <= 0 || angle <= 0) {
    return;
  }

  // Convert degrees to radians
  const radians = angle * Math.PI / 180;

  // Trigonometry formula
  const height = distance * Math.tan(radians);

  // Display result
  document.getElementById("height").innerText =
    "Height: " + height.toFixed(2) + " meters";
}
