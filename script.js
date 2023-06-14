var powerButton = document.getElementById("power-button");
var screens = document.getElementsByClassName("screen-content");
var currentScreen = 0;

powerButton.addEventListener("mousedown", function () {
  // Lorsque le bouton power est enfoncé, on démarre un timeout
  // Si le bouton est toujours enfoncé après 2 secondes, on passe à l'écran suivant
  powerButton.timeoutId = setTimeout(function () {
    screens[currentScreen].classList.remove("active");
    currentScreen = (currentScreen + 1) % screens.length;
    screens[currentScreen].classList.add("active");

    // Si l'écran actif est l'écran du logo Apple, on programme le changement à l'écran de verrouillage après 5 secondes
    if (currentScreen === 1) {
      setTimeout(function () {
        screens[currentScreen].classList.remove("active");
        currentScreen = (currentScreen + 1) % screens.length;
        screens[currentScreen].classList.add("active");
      }, 5000);
    }
  }, 2000);
});

powerButton.addEventListener("mouseup", function () {
  // Lorsque le bouton power est relâché, on annule le timeout
  clearTimeout(powerButton.timeoutId);
});

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
    // L'écran de verrouillage est l'écran 2
    unlockStarted = true;
    startUnlockX = event.touches ? event.touches[0].clientX : event.clientX;
  }
}

function handleMove(event) {
  if (unlockStarted) {
    var currentX = event.touches ? event.touches[0].clientX : event.clientX;
    if (currentX - startUnlockX > 100) {
      // Modifier le nombre pour ajuster la distance nécessaire pour déverrouiller
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

