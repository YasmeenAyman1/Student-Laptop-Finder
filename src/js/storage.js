// Everything that touches localStorage lives here
const FAV_KEY = "lf-favorites";
const CMP_KEY = "lf-compare";
const THEME_KEY = "lf-theme";

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const getFavorites = () => read(FAV_KEY, []);
export const isFavorite = (id) => getFavorites().includes(id);

// returns true if the laptop is now a favorite
export function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter((f) => f !== id);
    write(CMP_KEY, getCompare().filter((c) => c !== id)); // removed favorites leave the comparison too
  } else {
    favs.push(id);
  }
  write(FAV_KEY, favs);
  return favs.includes(id);
}

export function clearFavorites() {
  write(FAV_KEY, []);
  write(CMP_KEY, []);
}

export const getCompare = () => read(CMP_KEY, []);

// max 4 laptops in the comparison; returns { ok, selected }
export function toggleCompare(id) {
  const list = getCompare();
  if (list.includes(id)) {
    write(CMP_KEY, list.filter((c) => c !== id));
    return { ok: true, selected: false };
  }
  if (list.length >= 4) return { ok: false, selected: false };
  write(CMP_KEY, [...list, id]);
  return { ok: true, selected: true };
}

export const getTheme = () => read(THEME_KEY, "saver");
export const setTheme = (theme) => write(THEME_KEY, theme);