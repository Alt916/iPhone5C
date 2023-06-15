var powerButton = document.getElementById("power-button");
var screens = document.getElementsByClassName("screen-content");
var currentScreen = 0;
var longPressDelay = 2000; // 2 seconds delay for long press
var isMouseDown = false;

powerButton.addEventListener("mousedown", function () {
  // Track mouse down state
  isMouseDown = true;

  // If power button is still pressed after longPressDelay, switch the screen
  powerButton.timeoutId = setTimeout(function () {
    if(isMouseDown) switchScreen();
  }, longPressDelay);
});

powerButton.addEventListener("mouseup", function () {
  // Update mouse down state
  isMouseDown = false;

  // Cancel the timeout when power button is released
  clearTimeout(powerButton.timeoutId);
});

powerButton.addEventListener("touchstart", function (event) {
  // Prevent default touch behaviour
  event.preventDefault();

  // Similar to mousedown event
  isMouseDown = true;
  powerButton.timeoutId = setTimeout(function () {
    if(isMouseDown) switchScreen();
  }, longPressDelay);
});

powerButton.addEventListener("touchend", function (event) {
  // Prevent default touch behaviour
  event.preventDefault();

  // Similar to mouseup event
  isMouseDown = false;
  clearTimeout(powerButton.timeoutId);
});

function switchScreen() {
  screens[currentScreen].classList.remove("active");
  currentScreen = (currentScreen + 1) % screens.length;
  screens[currentScreen].classList.add("active");

  // If the active screen is the Apple logo screen, schedule the switch to the lock screen after 5 seconds
  if (currentScreen === 1) {
    setTimeout(function () {
      screens[currentScreen].classList.remove("active");
      currentScreen = (currentScreen + 1) % screens.length;
      screens[currentScreen].classList.add("active");
    }, 5000);
  }
}


function updateDateTime() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  var timeString = hours + ":" + minutes;
  document.getElementById("time").innerText = timeString;

  var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  var dateString = now.toLocaleDateString("fr-FR", options);
  document.getElementById("date").innerText = dateString;
}

// Mise à jour de l'heure et de la date toutes les minutes
setInterval(updateDateTime, 60000);

// Mise à jour de l'heure et de la date immédiatement
updateDateTime();

var unlockStarted = false;
var startUnlockX;

function handleStart(event) {
  if (currentScreen === 2) {
    unlockStarted = true;
    startUnlockX = event.touches ? event.touches[0].clientX : event.clientX;
  }
}

function handleMove(event) {
  if (unlockStarted) {
    var currentX = event.touches ? event.touches[0].clientX : event.clientX;
    if (currentX - startUnlockX > 100) {
      screens[currentScreen].classList.remove("active");
      currentScreen = (currentScreen + 1) % screens.length;
      screens[currentScreen].classList.add("active");
      unlockStarted = false;
    }
  }
}

function handleEnd() {
  unlockStarted = false;
}

// Pour les appareils tactiles
document.addEventListener("touchstart", handleStart);
document.addEventListener("touchmove", handleMove);
document.addEventListener("touchend", handleEnd);

// Pour les ordinateurs de bureau
document.addEventListener("mousedown", handleStart);
document.addEventListener("mousemove", handleMove);
document.addEventListener("mouseup", handleEnd);
