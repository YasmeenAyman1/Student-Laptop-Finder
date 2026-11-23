import { getLaptops } from "./api.js";
import { renderHeader, renderFooter, createCard, skeletonCards, showMessage, updateFavButtons, bindFavorites } from "./ui.js";

renderHeader();
renderFooter();

const grid = document.getElementById("grid");
const count = document.getElementById("count");
const filters = document.getElementById("filters");
const searchEl = document.getElementById("search");
const categoryEl = document.getElementById("category");
const maxPriceEl = document.getElementById("maxPrice");
const minRamEl = document.getElementById("minRam");
const sortEl = document.getElementById("sort");
let all = [];

// filter() drives search + category + max price + min RAM together
const filterLaptops = (list, f) =>
  list.filter((l) =>
    `${l.name} ${l.brand}`.toLowerCase().includes(f.search) &&
    (f.category === "all" || l.category === f.category) &&
    l.price <= f.maxPrice &&
    l.ramGB >= f.minRam
  );

// sort() on a COPY so the original array is not changed. value looks like "price-asc"
const sortLaptops = (list, value) => {
  const [key, dir] = value.split("-");
  if (value === "default") return list;
  return [...list].sort((a, b) => (dir === "asc" ? a[key] - b[key] : b[key] - a[key]));
};

function render() {
  const f = {
    search: searchEl.value.trim().toLowerCase(),
    category: categoryEl.value,
    maxPrice: Number(maxPriceEl.value) || Infinity,
    minRam: Number(minRamEl.value),
  };
  const result = sortLaptops(filterLaptops(all, f), sortEl.value);
  count.textContent = `${result.length} of ${all.length} laptops`;
  if (!result.length) {
    showMessage(grid, "No laptop matches your filters. Try changing them.");
    return;
  }
  grid.innerHTML = result.map(createCard).join("");
  updateFavButtons(grid);
}

async function init() {
  grid.innerHTML = skeletonCards(8);
  try {
    all = await getLaptops();
    const categories = [...new Set(all.map((l) => l.category))];
    categoryEl.innerHTML += categories.map((c) => `<option value="${c}">${c}</option>`).join("");
    render();
  } catch (err) {
    count.textContent = "";
    showMessage(grid, err.message);
  }
}

filters.addEventListener("input", render); // live: fires on every key / change
document.getElementById("reset").addEventListener("click", () => {
  filters.querySelectorAll("input").forEach((i) => (i.value = ""));
  categoryEl.value = "all";
  minRamEl.value = "0";
  sortEl.value = "default";
  render();
});
bindFavorites(grid);
init();
