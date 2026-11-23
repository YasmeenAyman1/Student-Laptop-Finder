import { getLaptops, findLaptop } from "./api.js";
import { getCompare, isFavorite, toggleFavorite, toggleCompare } from "./storage.js";
import { renderHeader, renderFooter, showMessage, formatPrice, updateFavButtons, bindFavorites } from "./ui.js";

renderHeader();
renderFooter();

const root = document.getElementById("detail");
// id comes from the URL: details.html?id=7
const id = Number(new URLSearchParams(location.search).get("id"));

const specRows = (l) => [
  ["ID", l.id], ["Brand", l.brand], ["Category", l.category], ["CPU", l.cpu],
  ["RAM", `${l.ramGB} GB`], ["Storage", `${l.storageGB} GB`],
  ["Battery", `${l.batteryHours} hours`], ["Weight", `${l.weightKg} kg`],
  ["Screen", `${l.screenInches} inches`], ["Price", formatPrice(l.price)],
];

async function init() {
  root.innerHTML = `<div class="laptop-card h-96 animate-pulse"></div>`;
  try {
    const laptops = await getLaptops();
    const l = findLaptop(laptops, id);
    if (!l) {
      showMessage(root, `Laptop not found. <a class="underline text-accent" href="laptops.html">Back to the catalogue</a>`);
      return;
    }
    document.title = `${l.name} | Laptop Finder`;
    root.innerHTML = `
      <div class="grid gap-8 md:grid-cols-2">
        <img src="${l.image}" alt="${l.name}" class="w-full rounded-xl object-cover">
        <div>
          <h1 class="text-3xl font-bold">${l.name}</h1>
          <p class="capitalize text-muted">${l.brand} · ${l.category}</p>
          <p class="my-3 text-4xl font-bold text-accent">${formatPrice(l.price)}</p>
          <div class="description"><p>${l.description}</p></div>
          <div class="mt-4 flex flex-wrap gap-3">
            <button type="button" data-fav="${l.id}" class="btn-action"></button>
            <button type="button" id="compare-btn" class="btn-ghost"></button>
          </div>
          <p id="msg" class="mt-3 text-sm text-muted" aria-live="polite"></p>
        </div>
      </div>
      <div class="mt-8 overflow-x-auto rounded-xl border border-line bg-card">
        <table class="w-full">
          <tbody>
            ${specRows(l).map(([k, v]) => `<tr class="border-t border-line first:border-t-0"><th class="p-3 text-left text-muted">${k}</th><td class="p-3">${v}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>`;

    const cmpBtn = document.getElementById("compare-btn");
    const msg = document.getElementById("msg");
    const cmpLabel = () => {
      cmpBtn.textContent = getCompare().includes(l.id) ? "✓ In comparison" : "⚖ Add to comparison";
    };
    cmpLabel();
    updateFavButtons(root);
    bindFavorites(root, cmpLabel);

    cmpBtn.addEventListener("click", () => {
      if (!isFavorite(l.id)) toggleFavorite(l.id); // comparison works on favorites only
      const r = toggleCompare(l.id);
      msg.textContent = r.ok ? (r.selected ? "Added to comparison." : "Removed from comparison.") : "You can compare a maximum of 4 laptops.";
      updateFavButtons(root);
      cmpLabel();
    });
  } catch (err) {
    showMessage(root, err.message);
  }
}
init();
