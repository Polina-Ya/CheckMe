
// === ИНИЦИАЛИЗАЦИЯ ===
let подписки = JSON.parse(localStorage.getItem("checkme_subs")) || [
  { id: 1, name: "Яндекс Плюс", price: 299, active: true, category: "Медиа" },
  { id: 2, name: "Skyeng", price: 1490, active: true, category: "Образование" },
  { id: 3, name: "iCloud", price: 149, active: false, category: "Облако" }
];

let карты = JSON.parse(localStorage.getItem("checkme_cards")) || ["• 1234"];
let семья = JSON.parse(localStorage.getItem("checkme_family")) || ["Анна"];
let donutChart, barChart, analyticsChart;

// === НАВИГАЦИЯ ===
function switchScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(`screen-${screen}`).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.querySelector(`[onclick*="${screen}"]`).classList.add("active");
  render();
}

// === ТАБЫ ПОДПИСОК ===
function toggleSubTab(type) {
  document.getElementById("tab-active").classList.toggle("active", type === "active");
  document.getElementById("tab-inactive").classList.toggle("active", type === "inactive");
  document.getElementById("active-subs").classList.toggle("hidden", type !== "active");
  document.getElementById("inactive-subs").classList.toggle("hidden", type !== "inactive");
}

// === ДОБАВИТЬ ПОДПИСКУ ===
function addSubPrompt() {
  const name = prompt("Название:");
  const price = parseInt(prompt("Сумма (₽):"));
  const category = prompt("Категория:");

  if (name && price && category) {
    подписки.push({ id: Date.now(), name, price, category, active: true });
    saveData();
    render();
  }
}

// === ДОБАВИТЬ КАРТУ ===
function addCard() {
  const last4 = prompt("Последние 4 цифры карты:");
  if (last4 && /^\d{4}$/.test(last4)) {
    карты.push("• " + last4);
    saveData();
    render();
  }
}

// === ДОБАВИТЬ УЧАСТНИКА ===
function addFamilyMember() {
  const name = prompt("Имя участника:");
  if (name) {
    семья.push(name);
    saveData();
    render();
  }
}

// === ПЕРЕКЛЮЧЕНИЕ СТАТУСА / УДАЛЕНИЕ ===
function toggleSub(id) {
  const sub = подписки.find(s => s.id === id);
  if (sub) {
    sub.active = !sub.active;
    saveData();
    render();
  }
}

function removeSub(id) {
  подписки = подписки.filter(s => s.id !== id);
  saveData();
  render();
}

// === СОХРАНЕНИЕ ===
function saveData() {
  localStorage.setItem("checkme_subs", JSON.stringify(подписки));
  localStorage.setItem("checkme_cards", JSON.stringify(карты));
  localStorage.setItem("checkme_family", JSON.stringify(семья));
}

// === ОТРИСОВКА ===
function render() {
  // Элементы
  const actList = document.getElementById("active-subs");
  const inactList = document.getElementById("inactive-subs");
  const totalEl = document.getElementById("total-balance");
  const cardsEl = document.getElementById("cards-list");
  const familyEl = document.getElementById("family-list");
  const barCanvas = document.getElementById("barChart");
  const donutCanvas = document.getElementById("donutChart");
  const analyticsCanvas = document.getElementById("analyticsChart");

  // Очистка
  actList.innerHTML = "";
  inactList.innerHTML = "";
  cardsEl.innerHTML = "";
  familyEl.innerHTML = "";

  let total = 0;
  const catMap = {};

  // Подписки
  подписки.forEach(sub => {
    const el = document.createElement("li");
    el.innerHTML = \`\${sub.name} — \${sub.price} ₽
      <div>
        <button onclick="toggleSub(\${sub.id})">🔄</button>
        <button onclick="removeSub(\${sub.id})">✖</button>
      </div>\`;

    if (sub.active) {
      actList.appendChild(el);
      total += sub.price;
      catMap[sub.category] = (catMap[sub.category] || 0) + sub.price;
    } else {
      inactList.appendChild(el);
    }
  });

  totalEl.textContent = "–" + total + " ₽";

  // Категории
  const labels = Object.keys(catMap);
  const values = Object.values(catMap);

  if (donutChart) donutChart.destroy();
  donutChart = new Chart(donutCanvas, {
    type: "doughnut",
    data: { labels, datasets: [{ data: values, backgroundColor: ["#3a7bd5", "#00a896", "#ffc107", "#ef476f"] }] },
    options: { responsive: false, plugins: { legend: { position: "bottom" } } }
  });

  if (barChart) barChart.destroy();
  barChart = new Chart(barCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "₽", data: values, backgroundColor: "#00a896" }]
    },
    options: { responsive: false, scales: { y: { beginAtZero: true } } }
  });

  if (analyticsChart) analyticsChart.destroy();
  analyticsChart = new Chart(analyticsCanvas, {
    type: "line",
    data: {
      labels: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
      datasets: [{
        label: "Траты",
        data: [2200, 2750, 2900, 3100, 3300, total],
        fill: false,
        borderColor: "#3a7bd5",
        tension: 0.3
      }]
    },
    options: { responsive: false }
  });

  // Карты
  карты.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c;
    cardsEl.appendChild(li);
  });

  // Семья
  семья.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m;
    familyEl.appendChild(li);
  });
}

// ИНИЦИАЛЬНЫЙ ЗАПУСК
render();
