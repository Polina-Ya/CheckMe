
const screens = ['subscriptions', 'report', 'settings', 'menu'];
function switchScreen(name) {
  screens.forEach(id => {
    document.getElementById(`screen-${id}`).classList.remove('active');
  });
  document.getElementById(`screen-${name}`).classList.add('active');
}

const subscriptions = [
  { name: 'Яндекс.Плюс', price: 199, category: 'Медиа', active: true },
  { name: 'Кинопоиск', price: 249, category: 'Медиа', active: true },
  { name: '1С-Бухгалтерия', price: 690, category: 'Бизнес', active: false },
  { name: 'IVI', price: 399, category: 'Медиа', active: true },
];

let filter = 'all';
let saved = 0;

function renderSubs() {
  const container = document.getElementById('subs-container');
  container.innerHTML = '';
  let total = 0;

  subscriptions.forEach((s, i) => {
    if (filter === 'active' && !s.active) return;
    if (filter === 'inactive' && s.active) return;
    if (s.active) total += s.price;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${s.name}</h3>
      <p>Категория: ${s.category}</p>
      <p>Сумма: ${s.price}₽</p>
      <button onclick="toggleStatus(${i})">${s.active ? 'Отключить' : 'Возобновить'}</button>
    `;
    container.appendChild(card);
  });

  document.getElementById('total').innerText = `💳 К списанию: ${total}₽`;
  document.getElementById('saved-count').innerText = saved;
}

function filterSubs(val) {
  filter = val;
  renderSubs();
}

function toggleStatus(index) {
  const sub = subscriptions[index];
  sub.active = !sub.active;
  saved += sub.active ? -sub.price : sub.price;
  renderSubs();
}

document.addEventListener('DOMContentLoaded', renderSubs);
