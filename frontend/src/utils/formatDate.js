/**
 * Formats an ISO date string (YYYY-MM-DD or YYYY-MM) or date text into a human-readable label.
 *
 * @param {string|null|undefined} dateStr  - Date string, e.g. "2022-06-01", "2022-06", "June 2022"
 * @param {string}                fallback - Value to return when dateStr is absent
 * @returns {string}
 */
export function formatDate(dateStr, fallback = "") {
    if (!dateStr) return fallback;

    const str = String(dateStr).trim();
    if (!str) return fallback;

    // Pre-formatted strings like "Present", "Current", "Jan 2022"
    if (/^[A-Za-z]{3,}\s+\d{4}$/.test(str) || str.toLowerCase() === "present") {
        return str;
    }

    // Try standard ISO parsing
    let date = new Date(str.includes("T") ? str : `${str}T00:00:00`);
    if (isNaN(date.getTime())) {
        date = new Date(str);
    }

    // Fallback to raw string if unparseable so we don't hide date text
    if (isNaN(date.getTime())) {
        return str;
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

/**
 * Formats a date range for display on a resume.
 * Returns "Month Year – Present" or "Month Year – Month Year".
 *
 * @param {string|null} startDate      - Start date
 * @param {string|null} endDate        - End date (null when currently active)
 * @param {boolean}     isCurrent      - Whether this entry is still ongoing
 * @returns {string}
 */
export function formatDateRange(startDate, endDate, isCurrent = false) {
    const start = formatDate(startDate, "");
    const end = isCurrent ? "Present" : formatDate(endDate, "");

    if (!start && !end) return "";
    if (!start) return end;
    if (!end) return start;

    return `${start} – ${end}`;
}
