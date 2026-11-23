import { getLaptops } from "./api.js";
import { getFavorites, clearFavorites } from "./storage.js";
import { renderHeader, renderFooter, createCard, skeletonCards, showMessage, formatPrice, updateFavButtons, bindFavorites } from "./ui.js";

renderHeader();
renderFooter();

const grid = document.getElementById("grid");
const totals = document.getElementById("totals");
let all = [];

function render() {
  const ids = getFavorites();
  const list = all.filter((l) => ids.includes(l.id));
  // reduce() for total price; average derived from it
  const total = list.reduce((sum, l) => sum + l.price, 0);
  const avg = list.length ? total / list.length : 0;
  totals.textContent = `Saved: ${list.length} · Total: ${formatPrice(total)} · Average: ${formatPrice(Math.round(avg))}`;
  if (!list.length) {
    showMessage(grid, `No favorites yet. <a class="underline text-accent" href="laptops.html">Browse laptops</a> and tap ♡ Save.`);
    return;
  }
  grid.innerHTML = list.map(createCard).join("");
  updateFavButtons(grid);
}

async function init() {
  grid.innerHTML = skeletonCards(3);
  try {
    all = await getLaptops();
    render();
  } catch (err) {
    showMessage(grid, err.message);
  }
}

bindFavorites(grid, render); // clicking ♥ Saved removes the laptop
document.getElementById("clear").addEventListener("click", () => {
  if (confirm("Remove all favorites?")) {
    clearFavorites();
    render();
  }
});
init();
