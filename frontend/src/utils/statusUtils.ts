function parseDate(dateStr: string): Date | null {
  const parts = dateStr.split(".");
  if (parts.length < 2) return null;

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  if (isNaN(day) || isNaN(month)) return null;

  let year;
  if (parts.length === 3 && parts[2]) {
    const yearPart = Number(parts[2]);
    if (isNaN(yearPart)) return null;
    year = yearPart < 100 ? 2000 + yearPart : yearPart;
  } else {
    year = new Date().getFullYear();
  }

  return new Date(year, month - 1, day);
}

function parseTimeRange(time?: string): { start?: { h: number; m: number }; end?: { h: number; m: number } } {
  if (!time) return {};
  // Podržava formate "HH:mm-HH:mm" ili "HH:mm – HH:mm"
  const parts = time.split(/[–-]/).map((p) => p.trim());
  const toHM = (t: string) => {
    const [h, m] = t.split(":").map((n) => Number(n));
    return isNaN(h) || isNaN(m) ? undefined : { h, m };
  };
  if (parts.length === 2) {
    return { start: toHM(parts[0]), end: toHM(parts[1]) };
  }
  if (parts.length === 1) {
    return { start: toHM(parts[0]) };
  }
  return {};
}

export function computeEventStatus(dateStr: string, time?: string): string {
  const now = new Date();
  const date = parseDate(dateStr);
  if (!date) return "ZAKAZANO";

  const { start, end } = parseTimeRange(time);
  
  // Kreiraj točne datume za početak i kraj
  const startDt = start ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), start.h, start.m) : new Date(date);
  const endDt = end ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), end.h, end.m) : undefined;

  if (endDt && now > endDt) return "završeno";
  if (now < startDt) return "ZAKAZANO";
  if (endDt && now >= startDt && now <= endDt) return "u tijeku...";
  
  // Fallback ako nema vremena završetka
  if (!endDt) {
    const isSameDay = now.toDateString() === startDt.toDateString();
    if (isSameDay && now >= startDt) return "u tijeku...";
    if (now.setHours(0,0,0,0) > startDt.setHours(0,0,0,0)) return "završeno";
  }

  return "ZAKAZANO";
}

export function isCancellationAllowed(dateStr: string, time?: string): boolean {
  const now = new Date();
  const date = parseDate(dateStr);
  if (!date) return false;

  const { start } = parseTimeRange(time);
  
  const startDt = start ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), start.h, start.m) : new Date(date);

  const fortyEightHoursInMs = 48 * 60 * 60 * 1000;
  
  return startDt.getTime() - now.getTime() > fortyEightHoursInMs;
}
