export interface RSVPEntry {
  id: string;
  name: string;
  attending: boolean;
  dishId: string | null;      // predefined dish id
  customDish: string | null;  // free-text dish
  createdAt: string;
}

export const STORAGE_KEY = "arraia-teixeira-rsvp";

export function loadRSVPs(): RSVPEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RSVPEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveRSVPs(entries: RSVPEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addRSVP(entry: Omit<RSVPEntry, "id" | "createdAt">): RSVPEntry {
  const newEntry: RSVPEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const existing = loadRSVPs();
  saveRSVPs([...existing, newEntry]);
  return newEntry;
}

export function getDishDisplayName(
  dishId: string | null,
  customDish: string | null,
  dishesMap: Map<string, string>
): string {
  if (customDish) return customDish;
  if (dishId) return dishesMap.get(dishId) ?? dishId;
  return "Não informado";
}
