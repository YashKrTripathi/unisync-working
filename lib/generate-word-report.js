import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
    BorderStyle,
    ShadingType,
    Header,
    Footer,
    PageNumber,
    NumberFormat,
} from "docx";
import { saveAs } from "file-saver";
import {
    formatReportDate,
    formatDuration,
    categoryLabel,
    inferSDGs,
    inferPOs,
} from "./report-helpers";

// ─── Colour constants ───────────────────────────────────────────────────────
const NAVY = "1E3A8A";
const WHITE = "FFFFFF";
const LIGHT_BG = "F5F7FA";

// ─── Reusable builders ─────────────────────────────────────────────────────
function sectionHeading(num, title) {
    return new Paragraph({
        spacing: { before: 360, after: 120 },
        shading: { type: ShadingType.SOLID, color: NAVY },
        children: [
            new TextRun({
                text: `  ${num}. ${title}`,
                bold: true,
                size: 24,
                color: WHITE,
                font: "Calibri",
            }),
        ],
    });
}

function keyValueRow(label, value) {
    return new Paragraph({
        spacing: { after: 60 },
        children: [
            new TextRun({ text: `${label}: `, bold: true, size: 20, font: "Calibri" }),
            new TextRun({ text: String(value || "N/A"), size: 20, font: "Calibri" }),
        ],
    });
}

function bulletPoint(text) {
    return new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 40 },
        children: [new TextRun({ text, size: 20, font: "Calibri" })],
    });
}

function emptyLine() {
    return new Paragraph({ spacing: { after: 80 }, children: [] });
}

// ─── Table helper ───────────────────────────────────────────────────────────
function attendeeTable(attendees) {
    const headerRow = new TableRow({
        tableHeader: true,
        children: ["#", "Name", "Email", "Checked In", "Check-in Time"].map(
            (h) =>
                new TableCell({
                    shading: { type: ShadingType.SOLID, color: NAVY },
                    width: h === "#" ? { size: 5, type: WidthType.PERCENTAGE } : { size: 23, type: WidthType.PERCENTAGE },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: h, bold: true, size: 18, color: WHITE, font: "Calibri" })],
                        }),
                    ],
                })
        ),
    });

    const dataRows = attendees.map((a, i) => {
        const values = [
            String(i + 1),
            a.name,
            a.email,
            a.checkedIn ? "Yes" : "No",
            a.checkedInAt ? formatReportDate(a.checkedInAt) : "—",
        ];
        return new TableRow({
            children: values.map(
                (val, ci) =>
                    new TableCell({
                        shading: i % 2 === 1 ? { type: ShadingType.SOLID, color: LIGHT_BG } : undefined,
                        width: ci === 0 ? { size: 5, type: WidthType.PERCENTAGE } : { size: 23, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({
                                alignment: ci === 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
                                children: [new TextRun({ text: val, size: 18, font: "Calibri" })],
                            }),
                        ],
                    })
            ),
        });
    });

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        },
        rows: [headerRow, ...dataRows],
    });
}

// ─── Main export function ───────────────────────────────────────────────────
/**
 * Generate a structured Event Report as a .docx Word file and trigger download.
 * @param {Object} reportData — full report payload from Convex `getEventReportData`
 * @param {Object} extras     — user-supplied extras (objectives, outcomes, brief, feedback, photos)
 */
export async function generateEventReportWord(reportData, extras = {}) {
    const { event, organizer, stats, attendees } = reportData;

    const objectives =
        extras.objectives && extras.objectives.length > 0
            ? extras.objectives
            : [
                `To provide comprehensive knowledge on ${event.title}`,
                `To enhance practical skills in ${categoryLabel(event.category)}`,
                `To foster networking and professional growth among participants`,
                `To expose students to real-world applications and industry practices`,
            ];

    const outcomes =
        extras.outcomes && extras.outcomes.length > 0
            ? extras.outcomes
            : [
                `Comprehensive understanding of ${event.title} concepts`,
                `Technical proficiency in tools and technologies discussed`,
                `Exposure to real-world applications and case studies`,
                `Awareness of industry expectations and current market trends`,
                `Enhanced collaboration and teamwork among ${stats.totalCheckedIn} participants`,
            ];

    const briefReport =
        extras.briefReport ||
        `The event "${event.title}" was organized by ${organizer.name} and held on ${formatReportDate(event.startDate)} at ${event.locationType === "physical" ? event.venue : "an online platform"}. ` +
        `The event was categorized as "${categoryLabel(event.category)}" and attracted ${stats.totalRegistrations} registrations, of which ${stats.totalCheckedIn} participants attended.\n\n` +
        `Introduction: The event commenced with a welcome address by the organizing team, setting the tone and objectives for the day.\n\n` +
        `Core Content: The main sessions covered key topics related to ${event.tags?.join(", ") || event.category}, providing participants with both theoretical insights and practical exposure.\n\n` +
        `Interaction: An interactive Q&A session followed the core presentations, enabling participants to clarify doubts and engage in knowledge exchange.\n\n` +
        `Conclusion: The event concluded with a vote of thanks, followed by feedback collection from all attendees. The overall capacity utilization was ${stats.capacityUtilization}%.`;

    // Split brief into paragraphs
    const briefParagraphs = briefReport.split(/\n+/).filter(Boolean).map(
        (p) =>
            new Paragraph({
                spacing: { after: 80 },
                children: [new TextRun({ text: p.trim(), size: 20, font: "Calibri" })],
            })
    );

    const doc = new Document({
        creator: "UniSync Event Management",
        title: `Event Report - ${event.title}`,
        description: `Auto-generated event report for ${event.title}`,
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 720, right: 720, bottom: 720, left: 720 },
                    },
                },
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: "D. Y. Patil International University, Pune",
                                        bold: true,
                                        size: 18,
                                        color: NAVY,
                                        font: "Calibri",
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: `UniSync Event Report — ${event.title} | Page `,
                                        italics: true,
                                        size: 16,
                                        color: "888888",
                                        font: "Calibri",
                                    }),
                                    new TextRun({
                                        children: [PageNumber.CURRENT],
                                        italics: true,
                                        size: 16,
                                        color: "888888",
                                        font: "Calibri",
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                children: [
                    // ── Title Block ─────────────────────────────────────
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 40 },
                        children: [
                            new TextRun({
                                text: "EVENT REPORT",
                                bold: true,
                                size: 36,
                                color: NAVY,
                                font: "Calibri",
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 20 },
                        children: [
                            new TextRun({
                                text: `Generated on: ${formatReportDate(Date.now())}`,
                                italics: true,
                                size: 18,
                                color: "666666",
                                font: "Calibri",
                            }),
                        ],
                    }),
                    emptyLine(),

                    // ── 1. Basic Event Details ──────────────────────────
                    sectionHeading(1, "Basic Event Details"),
                    keyValueRow("Title of the Event", event.title),
                    keyValueRow("Type of Event", categoryLabel(event.category)),
                    keyValueRow("Organizing Dept/Club", extras.department || organizer.name),
                    keyValueRow(
                        "Date & Duration",
                        `${formatReportDate(event.startDate)} to ${formatReportDate(event.endDate)} (${formatDuration(event.startDate, event.endDate)})`
                    ),
                    keyValueRow(
                        "Venue",
                        event.locationType === "physical"
                            ? `${event.venue}, ${event.address || event.city}`
                            : "Online"
                    ),
                    keyValueRow("Target Participants", extras.targetParticipants || "Students, Faculty, Professionals"),
                    keyValueRow(
                        "No. of Participants",
                        `Registered: ${stats.totalRegistrations} | Attended: ${stats.totalCheckedIn}`
                    ),
                    keyValueRow("Coordinator(s)", extras.coordinators || organizer.name),
                    keyValueRow("Resource Person(s)", extras.resourcePersons || "N/A"),
                    emptyLine(),

                    // ── 2. Event Objectives ─────────────────────────────
                    sectionHeading(2, "Event Objectives"),
                    ...objectives.map((obj) => bulletPoint(obj)),
                    emptyLine(),
                    keyValueRow("SDGs Addressed", inferSDGs(event.category).join("; ")),
                    keyValueRow("POs Addressed", inferPOs(event.category).join("; ")),
                    emptyLine(),

                    // ── 3. Key Outcomes ──────────────────────────────────
                    sectionHeading(3, "Key Outcomes of the Event"),
                    ...outcomes.map((out) => bulletPoint(out)),
                    emptyLine(),

                    // ── 4. Brief Report ──────────────────────────────────
                    sectionHeading(4, "Brief Report (Detailed Description)"),
                    ...briefParagraphs,
                    emptyLine(),

                    // ── 5. Event Photographs ────────────────────────────
                    sectionHeading(5, "Event Photographs"),
                    ...(extras.photos && extras.photos.length > 0
                        ? extras.photos.map(
                            (p, i) => bulletPoint(`[Photo ${i + 1}: ${p.caption || "Event photograph"}]`)
                        )
                        : [
                            bulletPoint("[Photo 1: Speaker addressing the audience]"),
                            bulletPoint("[Photo 2: Group photo with participants]"),
                            bulletPoint("[Photo 3: Interaction or hands-on session]"),
                            new Paragraph({
                                spacing: { after: 80 },
                                children: [
                                    new TextRun({
                                        text: "Note: Attach high-quality geotagged photographs before final submission.",
                                        italics: true,
                                        size: 18,
                                        color: "888888",
                                        font: "Calibri",
                                    }),
                                ],
                            }),
                        ]),
                    emptyLine(),

                    // ── 6. Feedback Summary ──────────────────────────────
                    sectionHeading(6, "Feedback Summary"),
                    keyValueRow("Overall Satisfaction", extras.feedbackRating || `${stats.attendanceRate}% attendance rate`),
                    keyValueRow("Most Liked Aspect", extras.feedbackBest || "Hands-on practical sessions and expert interactions"),
                    keyValueRow("Area for Improvement", extras.feedbackImprove || "Extended session duration and more networking opportunities"),
                    emptyLine(),

                    // ── 7. Attendance Record ─────────────────────────────
                    sectionHeading(7, "Attendance Record"),
                    new Paragraph({
                        spacing: { after: 100 },
                        children: [
                            new TextRun({
                                text: `Total confirmed attendees: ${attendees.length}`,
                                size: 20,
                                font: "Calibri",
                            }),
                        ],
                    }),
                    ...(attendees.length > 0
                        ? [attendeeTable(attendees)]
                        : [bulletPoint("No confirmed registrations found for this event.")]),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const filename = `Event_Report_${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx`;
    saveAs(blob, filename);
    return filename;
}
