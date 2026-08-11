/**
 * Format a date object or string into standard human-readable format.
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  if (!date) return '-';
  const dateObj = typeof date === 'object' ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '-';
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}
