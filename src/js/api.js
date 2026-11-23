let cache = null;

export async function getLaptops() {
  if (cache) return cache;
  try {
    const res = await fetch("data/laptops.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    cache = await res.json();
    return cache;
  } catch (err) {
    throw new Error(`Could not load laptops (${err.message}). Run the site with Live Server.`);
  }
}

export const findLaptop = (laptops, id) => laptops.find((l) => l.id === id);