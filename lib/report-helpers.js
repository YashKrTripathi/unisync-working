import { format } from "date-fns";

/**
 * Format a timestamp to a readable date string
 */
export function formatReportDate(ts) {
    if (!ts) return "N/A";
    return format(new Date(ts), "dd/MM/yyyy, hh:mm a");
}

/**
 * Format duration between two timestamps
 */
export function formatDuration(startDate, endDate) {
    const diffMs = endDate - startDate;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
}

/**
 * Map category slug to display name
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
 * Determine SDGs based on event category (heuristic mapping)
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
 * Determine Programme Outcomes based on category
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
