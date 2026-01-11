export function formatMillisToRemainingTime(ms: number) {
  const SECONDS_IN_DAY = 86400;
  const DAYS_IN_MONTH = 30;

  const totalDays = Math.floor(ms / 1000 / SECONDS_IN_DAY);

  const months = Math.floor(totalDays / DAYS_IN_MONTH);
  const days = totalDays % DAYS_IN_MONTH;
  
  if (months > 0) {
    return `${months} month(s) and ${days} day(s)`;
  }

  return `${days} day(s)`;
}
