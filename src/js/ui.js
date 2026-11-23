import { getTheme, setTheme, isFavorite, toggleFavorite } from "./storage.js";

const THEME_LABELS = {
  performance: "⚡ Performance Mode",
  saver: "🍃 Battery Saver Mode",
};

export const formatPrice = (n) => `$${n.toLocaleString()}`;

export const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
};

// Restore the saved theme as soon as the module loads, so every page opens with the right theme
applyTheme(getTheme());

// Shared header (nav + theme switch + mobile toggle) injected into every page
export function renderHeader() {
  const links = [
    ["index.html", "Home"],
    ["laptops.html", "Laptops"],
    ["favorites.html", "Favorites"],
    ["compare.html", "Compare"],
  ];
  const page = location.pathname.split("/").pop() || "index.html";
  const navLinks = links
    .map(([href, label]) => `<a href="${href}" class="transition hover:text-accent ${page === href ? "font-bold text-accent" : ""}">${label}</a>`)
    .join("");

  document.getElementById("site-header").innerHTML = `
    <header class="sticky top-0 z-20 border-b border-line bg-card">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="index.html" class="text-xl font-bold text-accent">💻 Laptop Finder</a>
        <nav class="hidden items-center gap-6 md:flex">${navLinks}</nav>
        <div class="flex items-center gap-2">
          <button id="theme-toggle" type="button" class="btn-action text-sm"></button>
          <button id="menu-toggle" type="button" class="btn-ghost md:hidden" aria-label="Menu" aria-expanded="false">☰</button>
        </div>
      </div>
      <nav id="mobile-menu" class="hidden flex-col gap-3 px-4 pb-4 md:hidden">${navLinks}</nav>
    </header>`;

  const themeBtn = document.getElementById("theme-toggle");
  const showLabel = () => (themeBtn.textContent = THEME_LABELS[getTheme()]);
  showLabel();
  themeBtn.addEventListener("click", () => {
    const next = getTheme() === "saver" ? "performance" : "saver";
    setTheme(next);
    applyTheme(next);
    showLabel();
  });

  const menuBtn = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
    menu.classList.toggle("flex");
    menuBtn.setAttribute("aria-expanded", !menu.classList.contains("hidden"));
  });
}

export function renderFooter() {
  document.getElementById("site-footer").innerHTML = `
    <footer class="border-t border-line bg-card py-6 text-center text-sm text-muted">
      Student Laptop Finder · SW302 Assignment 2
    </footer>`;
}

// Laptop card (arrow function) reused on laptops.html and favorites.html
export const createCard = (l) => `
  <article class="laptop-card">
    <img src="${l.image}" alt="${l.name}" class="h-40 w-full rounded-lg object-cover" loading="lazy">
    <div class="mt-3 flex items-start justify-between gap-2">
      <div>
        <h3 class="font-bold">${l.name}</h3>
        <p class="text-sm capitalize text-muted">${l.brand} · ${l.category}</p>
      </div>
      <button type="button" data-fav="${l.id}" class="btn-ghost shrink-0 text-sm"></button>
    </div>
    <p class="mt-2 text-2xl font-bold text-accent">${formatPrice(l.price)}</p>
    <ul class="mt-2 space-y-1 text-sm text-muted">
      <li>${l.cpu}</li>
      <li>${l.ramGB} GB RAM · ${l.storageGB} GB SSD</li>
      <li>${l.batteryHours} h battery · ${l.weightKg} kg</li>
    </ul>
    <a href="details.html?id=${l.id}" class="btn-action mt-auto pt-2">View details</a>
  </article>`;

// Skeleton cards with the same shape as real cards
export const skeletonCards = (n = 6) =>
  Array.from({ length: n }, () => `
    <div class="laptop-card animate-pulse">
      <div class="h-40 rounded-lg bg-line"></div>
      <div class="mt-4 h-4 w-3/4 rounded bg-line"></div>
      <div class="mt-2 h-4 w-1/2 rounded bg-line"></div>
      <div class="mt-4 h-8 w-1/3 rounded bg-line"></div>
      <div class="mt-4 h-10 rounded-lg bg-line"></div>
    </div>`).join("");

export const showMessage = (el, html) => {
  el.innerHTML = `<p class="col-span-full rounded-xl border border-line bg-card p-8 text-center">${html}</p>`;
};

// Sets text + state of every favorite button inside root
export function updateFavButtons(root = document) {
  root.querySelectorAll("[data-fav]").forEach((btn) => {
    const saved = isFavorite(Number(btn.dataset.fav));
    btn.textContent = saved ? "♥ Saved" : "♡ Save";
    btn.setAttribute("aria-pressed", saved);
  });
}

// One click listener for all favorite buttons (event delegation)
export function bindFavorites(root, onChange) {
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-fav]");
    if (!btn) return;
    toggleFavorite(Number(btn.dataset.fav));
    updateFavButtons(root);
    onChange?.();
  });
}
