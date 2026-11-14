// Fixed three-letter months: Intl's en-GB short form writes "Sept", which
// sits oddly next to "Aug" and "Nov".
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "12 Apr 2026" in UTC. Falls back to the raw string if it is not a date. */
export function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return `${parsed.getUTCDate()} ${MONTHS[parsed.getUTCMonth()]} ${parsed.getUTCFullYear()}`;
}
