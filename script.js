const moodMessages = {
    happy: "You're shining today! Keep spreading that beautiful energy ✨💃🏾",
    tired: "Rest is productive too, babe. Take it easy and be kind to yourself 🛌💗",
    anxious: "Deep breath. You’ve survived 100% of your hardest days. You got this 💪🏾🫶🏾",
    hopeful: "That little spark inside you? It’s your dreams rooting for you. Keep going 🌟",
    moody: "Feel what you feel, queen. Emotions don’t make you weak — they make you real 💅🏾",
    calm: "Breathe in peace, exhale stress. This is your soft girl moment 💖☁"
};

let currentYear, currentMonth;

function showMood() {
    const mood = document.getElementById("moodSelect").value;
    const messageBox = document.getElementById("message");
    const log = document.getElementById("moodLog");

    if (mood) {
        const message = moodMessages[mood] || "Sending you love 💌";
        messageBox.innerText = message;

        // Get selected symptoms
        const symptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked'))
            .map(input => input.value)
            .join(", ") || "None";

        const now = new Date();
        const dateTimeStr = now.toLocaleString('en-GB'); // e.g., "17/04/2025"
        const entry = `${dateTimeStr}: ${mood.toUpperCase()} | Symptoms: ${symptoms} | ${message}`;
        const li = document.createElement('li');
        li.textContent = entry;
        log.prepend(li);

        // Save to localStorage
        let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
        moodHistory.unshift(entry);
        localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

        // Update calendar
        updateCalendar();

        // Reset form
        document.getElementById("moodSelect").value = "";
        document.querySelectorAll('input[name="symptom"]').forEach(checkbox => checkbox.checked = false);
    } else {
        messageBox.innerText = "Select how you feel, and I’ll whisper some love into your soul 💌";
    }
}

// Load log from localStorage on start
window.onload = function () {
    const saved = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const log = document.getElementById("moodLog");
    saved.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry;
        log.appendChild(li);
    });

    // Initialize calendar with current month
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    initCalendar();

    // Add event listeners
    document.getElementById("logMoodBtn").addEventListener("click", showMood);
    document.getElementById("prevMonthBtn").addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        initCalendar();
    });
    document.getElementById("nextMonthBtn").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        initCalendar();
    });
};

// Initialize calendar
function initCalendar() {
    const calendarDays = document.querySelector(".calendar-days");
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Update header
    document.querySelector("#calendar .header").textContent = `📅 ${monthNames[currentMonth]} ${currentYear}`;

    // Clear existing content
    calendarDays.innerHTML = '';

    // Add weekday headers
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        const div = document.createElement('div');
        div.textContent = day;
        div.style.fontWeight = 'bold';
        calendarDays.appendChild(div);
    });

    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        calendarDays.appendChild(document.createElement('div'));
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
        const div = document.createElement('div');
        div.textContent = day;
        div.className = 'calendar-day';
        div.onclick = () => showDayLog(currentYear, currentMonth, day);
        calendarDays.appendChild(div);
    }

    updateCalendar();
}

// Update calendar to highlight logged days
function updateCalendar() {
    const saved = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const days = document.querySelectorAll('.calendar-day');
    days.forEach(day => {
        const dayNum = parseInt(day.textContent);
        if (!dayNum) return;
        const dateStr = `${dayNum.toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;
        const hasLog = saved.some(entry => entry.startsWith(dateStr));
        day.classList.toggle('mood-logged', hasLog);
    });
}

// Show logs for a specific day
function showDayLog(year, month, day) {
    const saved = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const dateStr = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`; // e.g., "17/04/2025"
    const dayLogs = saved.filter(entry => entry.startsWith(dateStr));
    const log = document.getElementById("moodLog");
    log.innerHTML = `<h3>📝 Logs for ${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}</h3>`;
    if (dayLogs.length) {
        dayLogs.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = entry;
            log.appendChild(li);
        });
    } else {
        log.innerHTML += '<p>No moods logged for this day.</p>';
    }
}

// Sparkly cursor trail
document.body.addEventListener("mousemove", function (e) {
    const sparkle = document.createElement("div");
    sparkle.className = 'sparkle';
    sparkle.style.left = `${e.pageX - 6}px`;
    sparkle.style.top = `${e.pageY - 6}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 500);
});