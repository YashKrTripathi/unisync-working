/**
 * Report helper utilities — standalone version.
 * No date-fns dependency; uses native Intl.DateTimeFormat.
 */

/**
 * Format a Date or timestamp to a readable string.
 * @param {number|Date|string} ts
 * @returns {string}
 */
export function formatReportDate(ts) {
    if (!ts) return "N/A";
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }) + ", " + d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

/**
 * Format duration between two timestamps.
 * @param {number|Date} start
 * @param {number|Date} end
 * @returns {string}
 */
export function formatDuration(start, end) {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diffMs = Math.abs(e - s);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
}

/**
 * Map category slug to display name.
 */
export function categoryLabel(cat) {
    const map = {
        tech: "Technology / Workshop",
        cultural: "Cultural Event",
        sports: "Sports Event",
        academic: "Academic / Seminar",
        workshop: "Workshop",
        seminar: "Seminar",
        webinar: "Webinar",
        hackathon: "Hackathon",
        conference: "Conference",
        social: "Social Event",
    };
    return map[cat?.toLowerCase()] || cat || "General";
}

/**
 * Infer SDGs based on event category.
 */
export function inferSDGs(category) {
    const map = {
        tech: ["SDG 4: Quality Education", "SDG 9: Industry, Innovation and Infrastructure"],
        academic: ["SDG 4: Quality Education"],
        seminar: ["SDG 4: Quality Education", "SDG 17: Partnerships for the Goals"],
        workshop: ["SDG 4: Quality Education", "SDG 8: Decent Work and Economic Growth"],
        hackathon: ["SDG 4: Quality Education", "SDG 9: Industry, Innovation and Infrastructure"],
        cultural: ["SDG 4: Quality Education", "SDG 11: Sustainable Cities and Communities"],
        sports: ["SDG 3: Good Health and Well-Being", "SDG 4: Quality Education"],
        social: ["SDG 10: Reduced Inequalities", "SDG 11: Sustainable Cities and Communities"],
        webinar: ["SDG 4: Quality Education", "SDG 17: Partnerships for the Goals"],
        conference: ["SDG 4: Quality Education", "SDG 17: Partnerships for the Goals"],
    };
    return map[category?.toLowerCase()] || ["SDG 4: Quality Education"];
}

/**
 * Infer Programme Outcomes based on category.
 */
export function inferPOs(category) {
    const map = {
        tech: ["PO1: Engineering Knowledge", "PO2: Problem Analysis", "PO5: Modern Tool Usage", "PO12: Life-long Learning"],
        academic: ["PO1: Engineering Knowledge", "PO12: Life-long Learning"],
        hackathon: ["PO1: Engineering Knowledge", "PO2: Problem Analysis", "PO3: Design/Development of Solutions", "PO5: Modern Tool Usage"],
        workshop: ["PO2: Problem Analysis", "PO5: Modern Tool Usage", "PO12: Life-long Learning"],
        seminar: ["PO1: Engineering Knowledge", "PO12: Life-long Learning"],
        cultural: ["PO8: Ethics", "PO9: Individual and Team Work", "PO10: Communication"],
        sports: ["PO9: Individual and Team Work", "PO10: Communication"],
        webinar: ["PO1: Engineering Knowledge", "PO12: Life-long Learning"],
        social: ["PO6: The Engineer and Society", "PO8: Ethics"],
    };
    return map[category?.toLowerCase()] || ["PO12: Life-long Learning"];
}
