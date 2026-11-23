import { getLaptops } from "./api.js";
import { getFavorites, getCompare, toggleCompare } from "./storage.js";
import { buildCompareTable } from "./compare.js";
import { renderHeader, renderFooter, showMessage } from "./ui.js";

renderHeader();
renderFooter();

const picker = document.getElementById("picker");
const table = document.getElementById("table");
const msg = document.getElementById("msg");
let all = [];

function render() {
  const favs = all.filter((l) => getFavorites().includes(l.id));
  const selected = getCompare();
  if (!favs.length) {
    showMessage(picker, `Save some laptops first. <a class="underline text-accent" href="laptops.html">Browse laptops</a>`);
    table.innerHTML = "";
    return;
  }
  picker.innerHTML = favs
    .map((l) => `
      <label class="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 transition hover:border-accent">
        <input type="checkbox" data-cmp="${l.id}" class="text-accent" ${selected.includes(l.id) ? "checked" : ""}>
        ${l.name}
      </label>`)
    .join("");
  const chosen = favs.filter((l) => selected.includes(l.id));
  if (chosen.length >= 2) table.innerHTML = buildCompareTable(chosen);
  else showMessage(table, "Pick at least 2 favorites to compare.");
}

picker.addEventListener("change", (e) => {
  const r = toggleCompare(Number(e.target.dataset.cmp));
  msg.textContent = r.ok ? "" : "You can compare a maximum of 4 laptops. Uncheck one first.";
  render();
});

async function init() {
  try {
    all = await getLaptops();
    render();
  } catch (err) {
    showMessage(table, err.message);
  }
}
init();
