

let подписки = JSON.parse(localStorage.getItem("subs")) || [
  { id: 1, name: "Яндекс Плюс", price: 299, category: "Медиа", active: true },
  { id: 2, name: "Кинопоиск", price: 399, category: "Видео", active: true },
  { id: 3, name: "IVI", price: 399, category: "Видео", active: true },
  { id: 4, name: "СберПрайм", price: 199, category: "Финансы", active: true },
  { id: 5, name: "VK Музыка", price: 149, category: "Музыка", active: true },
  { id: 6, name: "Тинькофф Про", price: 199, category: "Финансы", active: false },
  { id: 7, name: "Облако Mail.ru", price: 99, category: "Облако", active: true }
];

let карты = [], семья = [];
let donutChart, barChart, analyticsChart;
let savingsCounter = 0, savingsGoal = 1000;

function switchScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("screen-" + screen).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.nav-btn[data-target="${screen}"]`).classList.add("active");
  render();
}
function toggleSubTab(type) {
  document.getElementById("tab-active").classList.toggle("active", type === "active");
  document.getElementById("tab-inactive").classList.toggle("active", type !== "active");
  document.getElementById("active-subs").classList.toggle("hidden", type !== "active");
  document.getElementById("inactive-subs").classList.toggle("hidden", type === "active");
}
function addSubPrompt() {
  const name = prompt("Название:");
  const price = parseFloat(prompt("Цена:"));
  const category = prompt("Категория:");
  if (name && price && category) {
    подписки.push({ id: Date.now(), name, price, category, active: true });
    saveData(); render();
  }
}
function toggleSub(id) {
  const s = подписки.find(s => s.id === id);
  if (s) s.active = !s.active;
  saveData(); render();
}
function removeSub(id) {
  подписки = подписки.filter(s => s.id !== id);
  saveData(); render();
}
function addCard() {
  const last4 = prompt("Последние 4 цифры карты:");
  if (/^\d{4}$/.test(last4)) {
    карты.push("• " + last4);
    saveData(); render();
  }
}
function addFamilyMember() {
  const name = prompt("Имя:");
  if (name) {
    семья.push(name);
    saveData(); render();
  }
}
function removeFamilyMember(index) {
  семья.splice(index, 1);
  saveData(); render();
}
function saveData() {
  localStorage.setItem("subs", JSON.stringify(подписки));
  localStorage.setItem("cards", JSON.stringify(карты));
  localStorage.setItem("family", JSON.stringify(семья));
  localStorage.setItem("name", document.getElementById("profile-name").value);
  localStorage.setItem("email", document.getElementById("profile-email").value);
}
function sendReminder(email) {
  const message = "Ваши активные подписки:\n" + подписки.filter(s => s.active).map(s => `${s.name} — ${s.price}₽`).join("\n");
  alert(`Email отправлен на ${email} (имитация):\n\n` + message);
}
function exportToPDF() {
  const doc = new jspdf.jsPDF();
  doc.text("Подписки CheckMe", 14, 16);
  подписки.forEach((s, i) => {
    doc.text(`${s.name}: ${s.price}₽ (${s.active ? "активна" : "неактуальна"})`, 14, 30 + i * 10);
  });
  doc.save("checkme_report.pdf");
}
function exportToExcel() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(подписки.map(s => ({
    Название: s.name, Сумма: s.price, Категория: s.category, Статус: s.active ? "Активна" : "Неактуальна"
  })));
  XLSX.utils.book_append_sheet(wb, ws, "Подписки");
  XLSX.writeFile(wb, "checkme.xlsx");
}
function handleCSVImport(file) {
  const reader = new FileReader();
  reader.onload = e => {
    const lines = e.target.result.split('\n').slice(1);
    const freq = {};
    for (const line of lines) {
      const [date, desc, amount] = line.split(',');
      if (!desc || !amount) continue;
      const name = desc.trim();
      const val = parseFloat(amount);
      if (!freq[name]) freq[name] = { total: val, count: 1 };
      else { freq[name].count++; freq[name].total += val; }
    }
    for (const n in freq) {
      const avg = Math.round(freq[n].total / freq[n].count);
      if (freq[n].count >= 2 && !подписки.find(s => s.name === n)) {
        подписки.push({ id: Date.now() + Math.random(), name: n, price: avg, category: "Импорт", active: true });
      }
    }
    saveData(); render(); alert("Импорт завершён.");
  };
  reader.readAsText(file);
}
function render(data = подписки) {
  const actList = document.getElementById("active-subs");
  const inactList = document.getElementById("inactive-subs");
  const totalEl = document.getElementById("total-balance");
  const cardsEl = document.getElementById("cards-list");
  const familyEl = document.getElementById("family-list");
  const donutCanvas = document.getElementById("donutChart");
  const barCanvas = document.getElementById("barChart");
  const lineCanvas = document.getElementById("analyticsChart");

  actList.innerHTML = inactList.innerHTML = cardsEl.innerHTML = familyEl.innerHTML = "";
  let total = 0;
  const catMap = {};
  data.forEach(s => {
    const el = document.createElement("li");
    el.innerHTML = `${s.name} — ${s.price}₽ <div><button onclick="toggleSub(${s.id})">🔄</button><button onclick="removeSub(${s.id})">✖</button></div>`;
    (s.active ? actList : inactList).appendChild(el);
    if (s.active) {
      total += s.price;
      catMap[s.category] = (catMap[s.category] || 0) + s.price;
    }
  });
  totalEl.textContent = "–" + total + " ₽";
  document.getElementById("savings-counter").textContent = "💰 Вы сэкономили: " + подписки.filter(s => !s.active).reduce((sum, s) => sum + s.price, 0) + " ₽";

  const labels = Object.keys(catMap), values = Object.values(catMap);
  if (donutChart) donutChart.destroy();
  donutChart = new Chart(donutCanvas, {
    type: 'doughnut', data: { labels, datasets: [{ data: values, backgroundColor: ["#3a7bd5","#00a896","#ffc107","#ef476f"] }] },
    options: { plugins: { legend: { position: "bottom" } } }
  });
  if (barChart) barChart.destroy();
  barChart = new Chart(barCanvas, {
    type: 'bar', data: { labels, datasets: [{ label: "₽", data: values, backgroundColor: "#00a896" }] },
    options: { scales: { y: { beginAtZero: true } } }
  });
  if (analyticsChart) analyticsChart.destroy();
  analyticsChart = new Chart(lineCanvas, {
    type: 'line', data: { labels: ["Янв","Фев","Мар","Апр","Май","Июн"], datasets: [{ label: "Траты", data: [2200,2750,2900,3100,3300,total], borderColor: "#3a7bd5", tension: 0.3 }] }
  });
  карты.forEach(c => { const li = document.createElement("li"); li.textContent = c; cardsEl.appendChild(li); });
  семья.forEach((m, i) => { const li = document.createElement("li"); li.innerHTML = `${m} <button onclick="removeFamilyMember(${i})">✖</button>`; familyEl.appendChild(li); });
}

window.addEventListener("load", () => {
  подписки = JSON.parse(localStorage.getItem("subs")) || [];
  карты = JSON.parse(localStorage.getItem("cards")) || [];
  семья = JSON.parse(localStorage.getItem("family")) || [];
  document.getElementById("profile-name").value = localStorage.getItem("name") || "Иван Иванов";
  document.getElementById("profile-email").value = localStorage.getItem("email") || "you@example.com";

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => switchScreen(btn.getAttribute("data-target")));
  });

  toggleSubTab("active");
  render();
});
