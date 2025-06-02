
window.addEventListener("load", () => {
  const ctx = document.getElementById("demoChart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['A', 'B', 'C'],
      datasets: [{
        label: 'Demo',
        data: [10, 20, 15],
        backgroundColor: '#00a896'
      }]
    }
  });
});
