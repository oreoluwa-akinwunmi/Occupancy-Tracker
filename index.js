const STORAGE_KEY = "counterEntries";

const countEl = document.getElementById("count-el");
const saveEl = document.getElementById("save-el");
const entryCountEl = document.getElementById("entry-count");
const statusMessageEl = document.getElementById("status-message");
const incrementBtn = document.getElementById("increment-btn");
const decrementBtn = document.getElementById("decrement-btn");
const saveBtn = document.getElementById("save-btn");
const resetBtn = document.getElementById("reset-btn");

let count = 0;
let entries = loadEntries();

function loadEntries() {
    try {
        const savedEntries = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(savedEntries)
            ? savedEntries.filter((entry) => Number.isFinite(entry) && entry >= 0)
            : [];
    } catch (error) {
        console.error("Unable to load saved entries:", error);
        return [];
    }
}

function saveEntries() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
        console.error("Unable to save entries:", error);
        statusMessageEl.textContent = "Could not save data in this browser.";
    }
}

function updateCountDisplay() {
    countEl.textContent = count;
    saveBtn.disabled = count === 0;
    decrementBtn.disabled = count === 0;
    resetBtn.disabled = count === 0 && entries.length === 0;

    countEl.classList.remove("pulse");
    void countEl.offsetWidth;
    countEl.classList.add("pulse");
}

function renderEntries() {
    saveEl.replaceChildren();

    if (entries.length === 0) {
        const emptyState = document.createElement("li");
        emptyState.className = "empty-state";
        emptyState.textContent = "No entries saved yet.";
        saveEl.appendChild(emptyState);
    } else {
        [...entries].reverse().forEach((entry, index) => {
            const item = document.createElement("li");
            item.className = "entry-item";

            const entryNumber = document.createElement("span");
            entryNumber.className = "entry-number";
            entryNumber.textContent = `Entry ${entries.length - index}`;

            const entryValue = document.createElement("span");
            entryValue.className = "entry-value";
            entryValue.textContent = `${entry} ${entry === 1 ? "person" : "people"}`;

            item.append(entryNumber, entryValue);
            saveEl.appendChild(item);
        });
    }

    const totalEntries = entries.length;
    entryCountEl.textContent = `${totalEntries} ${totalEntries === 1 ? "entry" : "entries"}`;
}

function setStatus(message) {
    statusMessageEl.textContent = message;
}

incrementBtn.addEventListener("click", () => {
    count += 1;
    updateCountDisplay();
    setStatus("Occupancy increased.");
});

decrementBtn.addEventListener("click", () => {
    if (count === 0) return;

    count -= 1;
    updateCountDisplay();
    setStatus("Occupancy decreased.");
});

saveBtn.addEventListener("click", () => {
    if (count === 0) return;

    entries.push(count);
    saveEntries();
    renderEntries();

    count = 0;
    updateCountDisplay();
    setStatus("Entry saved successfully.");
});

resetBtn.addEventListener("click", () => {
    count = 0;
    entries = [];
    localStorage.removeItem(STORAGE_KEY);

    updateCountDisplay();
    renderEntries();
    setStatus("Tracker and saved history have been reset.");
});

renderEntries();
updateCountDisplay();
