// Rows of the comparison table. best: "min" | "max" | null (no winner)
export const COMPARE_ROWS = [
  { label: "Price", key: "price", best: "min", format: (v) => `$${v}` },
  { label: "RAM", key: "ramGB", best: "max", format: (v) => `${v} GB` },
  { label: "Storage", key: "storageGB", best: "max", format: (v) => `${v} GB` },
  { label: "Battery", key: "batteryHours", best: "max", format: (v) => `${v} h` },
  { label: "Weight", key: "weightKg", best: "min", format: (v) => `${v} kg` },
  { label: "Screen", key: "screenInches", best: null, format: (v) => `${v}"` },
  { label: "CPU", key: "cpu", best: null, format: (v) => v },
];

// Picks the best value in a row using reduce(): lowest for price/weight, highest for the rest
export const bestValue = (laptops, row) => {
  if (!row.best) return null;
  const pick = row.best === "min" ? Math.min : Math.max;
  const start = row.best === "min" ? Infinity : -Infinity;
  return laptops.reduce((best, l) => pick(best, l[row.key]), start);
};

export function buildCompareTable(laptops) {
  const head = laptops
    .map((l) => `
      <th class="min-w-44 p-3 text-left">
        <img src="${l.image}" alt="${l.name}" class="mb-2 h-20 w-full rounded-lg object-cover">
        <a href="details.html?id=${l.id}" class="hover:text-accent">${l.name}</a>
      </th>`)
    .join("");

  const body = COMPARE_ROWS.map((row) => {
    const best = bestValue(laptops, row);
    const cells = laptops
      .map((l) => {
        const isBest = row.best && l[row.key] === best;
        return `<td class="p-3 ${isBest ? "bg-accent font-bold text-accent-ink" : ""}">${row.format(l[row.key])}</td>`;
      })
      .join("");
    return `<tr class="border-t border-line"><th class="p-3 text-left text-muted">${row.label}</th>${cells}</tr>`;
  }).join("");

  return `<table class="w-full border-collapse"><thead><tr><th></th>${head}</tr></thead><tbody>${body}</tbody></table>`;
}