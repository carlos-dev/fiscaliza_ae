/**
 * Formats a date string from DD/MM/YYYY to MMDDYY format
 * Example: 10/10/2024 -> 101024
 * @param dateString The date string in DD/MM/YYYY format
 * @returns The formatted date string in MMDDYY format
 */
export function formatReducedDate(dateString: string): string {
  if (!dateString) return "";

  // Remove slashes
  const withoutSlashes = dateString.replace(/\//g, "");

  // If the date is in the expected format, it should be 8 digits (DDMMYYYY)
  if (withoutSlashes.length === 8) {
    // Extract day, month, and last two digits of the year
    const day = withoutSlashes.substring(0, 2);
    const month = withoutSlashes.substring(2, 4);
    const yearDigits = withoutSlashes.substring(6, 8);

    // Return month, day, and last two digits of the year (MMDDYY)
    return month + day + yearDigits;
  }

  // If the date is not in the expected format, return the original without slashes
  return withoutSlashes;
}
