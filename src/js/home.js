import { getLaptops } from "./api.js";
import { getFavorites } from "./storage.js";
import { renderHeader, renderFooter, formatPrice, showMessage } from "./ui.js";

renderHeader();
renderFooter();

async function init() {
  const box = document.getElementById("stats");
  try {
    const laptops = await getLaptops();
    // reduce() calculates the live statistics
    const lowest = laptops.reduce((min, l) => Math.min(min, l.price), Infinity);
    const avgBattery = laptops.reduce((sum, l) => sum + l.batteryHours, 0) / laptops.length;
    const stats = [
      ["Laptops", laptops.length],
      ["Lowest price", formatPrice(lowest)],
      ["Avg battery", `${avgBattery.toFixed(1)} h`],
      ["Saved favorites", getFavorites().length],
    ];
    box.innerHTML = stats
      .map(([label, value]) => `
        <div class="laptop-card text-center">
          <p class="text-3xl font-bold text-accent">${value}</p>
          <p class="text-muted">${label}</p>
        </div>`)
      .join("");
  } catch (err) {
    showMessage(box, err.message);
  }
}
init();
