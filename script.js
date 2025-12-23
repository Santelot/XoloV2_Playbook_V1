// ========== THEME TOGGLE ==========
const themeToggleInput = document.getElementById("theme-toggle-input");
const body = document.body;

function setTheme() {
  if (localStorage.getItem("dark-mode") === "true") {
    body.classList.add("dark-mode");
    themeToggleInput.checked = true;
  } else {
    body.classList.remove("dark-mode");
    themeToggleInput.checked = false;
  }
}

setTheme();

themeToggleInput.addEventListener("change", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "true");
  } else {
    localStorage.setItem("dark-mode", "false");
  }
});

// ========== COLLAPSIBLE SECTIONS ==========
const collapsibleButtons = document.querySelectorAll(".collapsible-button");

collapsibleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    content.classList.toggle("active");
  });
});

// ========== GLOBAL TIMER (Countdown) ==========
const globalTimer = document.getElementById("global-timer");
const globalStartStopButton = document.getElementById("global-start-stop");
const globalResetButton = document.getElementById("global-reset");

let globalInterval;
let globalTimeLeft = 40 * 60; // 40 minutos en segundos
let globalTimerRunning = false;

function updateGlobalTimerDisplay() {
  const minutes = Math.floor(globalTimeLeft / 60);
  const seconds = globalTimeLeft % 60;
  globalTimer.textContent = `⏱️ ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  
  // Cambiar color según tiempo restante
  if (globalTimeLeft <= 60) {
    globalTimer.style.color = "#ff6b35"; // Naranja cuando queda 1 min
  } else if (globalTimeLeft <= 300) {
    globalTimer.style.color = "#fbc02d"; // Amarillo cuando quedan 5 min
  } else {
    globalTimer.style.color = "white";
  }
}

function startStopGlobalTimer() {
  if (globalTimerRunning) {
    clearInterval(globalInterval);
    globalStartStopButton.textContent = "Start";
  } else {
    globalInterval = setInterval(() => {
      if (globalTimeLeft > 0) {
        globalTimeLeft--;
        updateGlobalTimerDisplay();
        
        // Alerta al llegar a 0
        if (globalTimeLeft === 0) {
          clearInterval(globalInterval);
          globalTimerRunning = false;
          globalStartStopButton.textContent = "Start";
          alert("⏰ ¡Tiempo de misión terminado! (40 minutos)");
        }
      }
    }, 1000);
    globalStartStopButton.textContent = "Stop";
  }
  globalTimerRunning = !globalTimerRunning;
}

function resetGlobalTimer() {
  clearInterval(globalInterval);
  globalTimerRunning = false;
  globalTimeLeft = 40 * 60;
  updateGlobalTimerDisplay();
  globalStartStopButton.textContent = "Start";
}

globalStartStopButton.addEventListener("click", startStopGlobalTimer);
globalResetButton.addEventListener("click", resetGlobalTimer);

// ========== ACTIVITY TIMERS (Individual Countdown) ==========
let activityIntervals = {};

function updateActivityTimerDisplay(button, timeLeft) {
  const durationSpan = button.previousElementSibling;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  durationSpan.textContent = `⏱️ ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  
  // Cambiar color según tiempo restante
  if (timeLeft <= 30) {
    durationSpan.style.color = "#ff6b35"; // Naranja cuando quedan 30 seg
  } else if (timeLeft <= 60) {
    durationSpan.style.color = "#fbc02d"; // Amarillo cuando queda 1 min
  } else {
    durationSpan.style.color = "#00a3a3"; // Color normal
  }
}

function startActivityTimer(button) {
  const duration = parseInt(button.dataset.duration);
  const activityId = button.closest('.activity-card').id;
  
  // Si ya hay un timer corriendo para esta actividad, lo detenemos
  if (activityIntervals[activityId]) {
    clearInterval(activityIntervals[activityId].interval);
    delete activityIntervals[activityId];
    button.textContent = "Iniciar";
    button.classList.remove("running");
    
    // Restaurar tiempo original
    const originalMinutes = Math.floor(duration / 60);
    const originalSeconds = duration % 60;
    button.previousElementSibling.textContent = `⏱️ ${String(originalMinutes).padStart(2, "0")}:${String(originalSeconds).padStart(2, "0")}`;
    button.previousElementSibling.style.color = "#00a3a3";
    return;
  }
  
  // Iniciar nuevo timer
  let timeLeft = duration;
  button.classList.add("running");
  button.textContent = "Detener";
  
  const interval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateActivityTimerDisplay(button, timeLeft);
      
      // Alerta al llegar a 0
      if (timeLeft === 0) {
        clearInterval(interval);
        delete activityIntervals[activityId];
        button.textContent = "Iniciar";
        button.classList.remove("running");
        
        // Alerta visual
        const activityTitle = button.closest('.activity-card').querySelector('h2').textContent;
        alert(`⏰ ¡Tiempo de actividad terminado!\n\n${activityTitle}`);
        
        // Restaurar display original
        const originalMinutes = Math.floor(duration / 60);
        const originalSeconds = duration % 60;
        button.previousElementSibling.textContent = `⏱️ ${String(originalMinutes).padStart(2, "0")}:${String(originalSeconds).padStart(2, "0")}`;
        button.previousElementSibling.style.color = "#00a3a3";
      }
    }
  }, 1000);
  
  activityIntervals[activityId] = { interval, duration };
}

// Attach event listeners to activity timer buttons
document.addEventListener('DOMContentLoaded', () => {
  const timerButtons = document.querySelectorAll('.timer-start-btn');
  timerButtons.forEach(button => {
    button.addEventListener('click', () => startActivityTimer(button));
  });
});

// ========== COPY PROMPT FUNCTIONALITY ==========
function copyPrompt(promptId) {
  const promptElement = document.getElementById(promptId);
  const text = promptElement.textContent;
  
  navigator.clipboard.writeText(text).then(() => {
    // Feedback visual
    const copyBtn = event.target.closest('.copy-btn');
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado';
    copyBtn.style.backgroundColor = '#4caf50';
    
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.style.backgroundColor = '';
    }, 2000);
  }).catch(err => {
    alert('Error al copiar el texto. Por favor, cópialo manualmente.');
  });
}

// ========== ACTIVITY NAVIGATION ==========
const activityLinks = document.querySelectorAll(".activity-list a");
const activityCards = document.querySelectorAll(".activity-card");
const progressBar = document.querySelector(".progress");
const numberOfActivities = activityCards.length;

// Hide all activity cards initially
activityCards.forEach((card) => {
  card.classList.remove("active");
  card.style.display = "none";
});

// Function to show the selected activity card
function showActivity(activityId) {
  // Fade out the current active card
  const currentActive = document.querySelector(".activity-card.active");
  if (currentActive) {
    currentActive.classList.remove("active");
    setTimeout(() => {
      currentActive.style.display = "none";
    }, 333);
  }

  // Show the selected activity card and fade it in
  const selectedActivity = document.getElementById(activityId);
  if (selectedActivity) {
    selectedActivity.style.display = "block";
    setTimeout(() => {
      selectedActivity.classList.add("active");
    }, 50);

    // --- MODIFICATION START ---
    // Update active state on sidebar links
    activityLinks.forEach(link => link.classList.remove('active'));
    const correspondingLink = document.querySelector(`.activity-list a[href="#${activityId}"]`);
    if (correspondingLink) {
        correspondingLink.classList.add('active');
    }
    // --- MODIFICATION END ---
    
    updateProgressBar(activityId);
  }
}

// Function to update the progress bar
function updateProgressBar(activityId) {
  const activityIndex = parseInt(activityId.split("-")[1]);

  let progressPercentage;

  if (numberOfActivities <= 1) {
    progressPercentage = (activityIndex === 0 && numberOfActivities === 1) ? 100 : 0;
  } else {
    progressPercentage = (activityIndex / (numberOfActivities - 1)) * 100;
  }
  
  progressPercentage = Math.min(100, Math.max(0, progressPercentage));
  progressBar.style.width = `${progressPercentage}%`;
}

// Add event listeners to activity links
activityLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const activityId = link.getAttribute("href").substring(1);
    showActivity(activityId);
  });
});

// Show the first activity by default on initial load
if (activityCards.length > 0) {
  showActivity(activityCards[0].id);
}

