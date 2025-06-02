
let подписки = [];

function importCSV(file) {
  const reader = new FileReader();
  reader.onload = e => {
    const lines = e.target.result.split('\n').slice(1);
    const map = {};
    lines.forEach(line => {
      const [date, name, amount] = line.split(',');
      if (!name || !amount) return;
      const trimmed = name.trim();
      const value = parseFloat(amount);
      if (!map[trimmed]) map[trimmed] = { total: value, count: 1 };
      else { map[trimmed].total += value; map[trimmed].count += 1; }
    });
    for (const name in map) {
      if (map[name].count >= 2) {
        подписки.push({
          id: Date.now() + Math.random(),
          name,
          price: Math.round(map[name].total / map[name].count),
          category: "Не указано",
          active: true
        });
      }
    }
    render();
  };
  reader.readAsText(file);
}

function render() {
  const list = document.getElementById("subs");
  const savings = document.getElementById("savings");
  list.innerHTML = "";
  let total = 0, saved = 0, catMap = {};

  подписки.forEach(s => {
    const el = document.createElement("li");
    el.innerHTML = `<span>${s.name} — ${s.price}₽</span>
    <button onclick="removeSub(${s.id})">✖</button>`;
    list.appendChild(el);
    if (s.active) {
      total += s.price;
      catMap[s.category] = (catMap[s.category] || 0) + s.price;
    } else {
      saved += s.price;
    }
  });
  savings.textContent = "💰 Экономия: " + saved + " ₽";

  const bar = document.getElementById("barChart").getContext("2d");
  if (window.barChart) window.barChart.destroy();
  window.barChart = new Chart(bar, {
    type: 'bar',
    data: {
      labels: Object.keys(catMap),
      datasets: [{ label: 'Траты ₽', data: Object.values(catMap), backgroundColor: '#00a896' }]
    }
  });

  const line = document.getElementById("lineChart").getContext("2d");
  if (window.lineChart) window.lineChart.destroy();
  window.lineChart = new Chart(line, {
    type: 'line',
    data: {
      labels: ["Янв","Фев","Мар","Апр","Май","Июн"],
      datasets: [{ label: "Динамика", data: [2200, 2300, 2100, 2500, 2700, total], borderColor: "#3a7bd5" }]
    }
  });
}

function removeSub(id) {
  подписки = подписки.filter(s => s.id !== id);
  render();
}

function sendReminder() {
  const email = document.getElementById("remindEmail").value;
  alert(`Имитация отправки на ${email}\nСписок подписок:\n` + подписки.map(s => s.name + ' — ' + s.price + '₽').join('\n'));
}

function exportPDF() {
  const doc = new jspdf.jsPDF();
  doc.text("Отчет CheckMe", 14, 16);
  подписки.forEach((s, i) => {
    doc.text(`${s.name}: ${s.price}₽`, 14, 30 + i * 10);
  });
  doc.save("checkme.pdf");
}

function exportExcel() {
  const ws = XLSX.utils.json_to_sheet(подписки);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Подписки");
  XLSX.writeFile(wb, "checkme.xlsx");
}
