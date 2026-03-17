import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    formatReportDate,
    formatDuration,
    categoryLabel,
    inferSDGs,
    inferPOs,
} from "./report-helpers";

/**
 * Generate a structured Event Report PDF matching the institutional format.
 * @param {Object} reportData  — full report payload from Convex `getEventReportData`
 * @param {Object} extras      — user-supplied extras (objectives, outcomes, brief, feedback, photos)
 * @returns {jsPDF} doc instance (caller can .save() or .output())
 */
export function generateEventReportPDF(reportData, extras = {}) {
    const { event, organizer, stats, attendees, auditLog } = reportData;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // ─── Utility helpers ────────────────────────────────────────────────
    const addPageIfNeeded = (requiredSpace = 30) => {
        if (y + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            y = margin;
        }
    };

    const drawSectionHeader = (title, sectionNum) => {
        addPageIfNeeded(20);
        doc.setFillColor(30, 58, 138); // dypiu-navy
        doc.rect(margin, y, contentWidth, 9, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text(`${sectionNum}. ${title}`, margin + 3, y + 6.5);
        y += 13;
        doc.setTextColor(30, 30, 30);
    };

    const drawKeyValue = (label, value) => {
        addPageIfNeeded(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.text(`${label}:`, margin + 2, y);
        doc.setFont("helvetica", "normal");
        const valX = margin + 60;
        const lines = doc.splitTextToSize(String(value || "N/A"), contentWidth - 62);
        doc.text(lines, valX, y);
        y += lines.length * 5 + 2;
    };

    const drawBullet = (text) => {
        addPageIfNeeded(8);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.text("•", margin + 4, y);
        const lines = doc.splitTextToSize(text, contentWidth - 14);
        doc.text(lines, margin + 10, y);
        y += lines.length * 5 + 1.5;
    };

    const drawParagraph = (text) => {
        addPageIfNeeded(12);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        const lines = doc.splitTextToSize(text, contentWidth - 4);
        doc.text(lines, margin + 2, y);
        y += lines.length * 5 + 3;
    };

    // ─── Title Block ────────────────────────────────────────────────────
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 38, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("EVENT REPORT", pageWidth / 2, 14, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("D. Y. Patil International University, Pune", pageWidth / 2, 22, { align: "center" });
    doc.setFontSize(9);
    doc.text(`Generated on: ${formatReportDate(Date.now())}`, pageWidth / 2, 30, { align: "center" });
    y = 46;

    // ─── 1. Basic Event Details ─────────────────────────────────────────
    drawSectionHeader("Basic Event Details", 1);
    drawKeyValue("Title of the Event", event.title);
    drawKeyValue("Type of Event", categoryLabel(event.category));
    drawKeyValue("Organizing Dept/Club", extras.department || organizer.name);
    drawKeyValue("Date & Duration", `${formatReportDate(event.startDate)} to ${formatReportDate(event.endDate)} (${formatDuration(event.startDate, event.endDate)})`);
    drawKeyValue("Venue", event.locationType === "physical" ? `${event.venue}, ${event.address || event.city}` : "Online");
    drawKeyValue("Target Participants", extras.targetParticipants || "Students, Faculty, Professionals");
    drawKeyValue("No. of Participants", `Registered: ${stats.totalRegistrations} | Attended: ${stats.totalCheckedIn}`);
    drawKeyValue("Coordinator(s)", extras.coordinators || organizer.name);
    drawKeyValue("Resource Person(s)", extras.resourcePersons || "N/A");

    y += 4;

    // ─── 2. Event Objectives ────────────────────────────────────────────
    drawSectionHeader("Event Objectives", 2);

    const objectives = extras.objectives && extras.objectives.length > 0
        ? extras.objectives
        : [
            `To provide comprehensive knowledge on ${event.title}`,
            `To enhance practical skills in ${categoryLabel(event.category)}`,
            `To foster networking and professional growth among participants`,
            `To expose students to real-world applications and industry practices`,
        ];
    objectives.forEach((obj) => drawBullet(obj));

    y += 2;
    drawKeyValue("SDGs Addressed", inferSDGs(event.category).join("; "));
    drawKeyValue("POs Addressed", inferPOs(event.category).join("; "));
    y += 4;

    // ─── 3. Key Outcomes ────────────────────────────────────────────────
    drawSectionHeader("Key Outcomes of the Event", 3);

    const outcomes = extras.outcomes && extras.outcomes.length > 0
        ? extras.outcomes
        : [
            `Comprehensive understanding of ${event.title} concepts`,
            `Technical proficiency in tools and technologies discussed`,
            `Exposure to real-world applications and case studies`,
            `Awareness of industry expectations and current market trends`,
            `Enhanced collaboration and teamwork among ${stats.totalCheckedIn} participants`,
        ];
    outcomes.forEach((out) => drawBullet(out));
    y += 4;

    // ─── 4. Brief Report ────────────────────────────────────────────────
    drawSectionHeader("Brief Report (Detailed Description)", 4);

    const briefReport = extras.briefReport || `The event "${event.title}" was organized by ${organizer.name} and held on ${formatReportDate(event.startDate)} at ${event.locationType === "physical" ? event.venue : "an online platform"}. ` +
        `The event was categorized as "${categoryLabel(event.category)}" and attracted ${stats.totalRegistrations} registrations, of which ${stats.totalCheckedIn} participants attended. ` +
        `\n\nIntroduction: The event commenced with a welcome address by the organizing team, setting the tone and objectives for the day. ` +
        `\n\nCore Content: The main sessions covered key topics related to ${event.tags?.join(", ") || event.category}, providing participants with both theoretical insights and practical exposure. ` +
        `\n\nInteraction: An interactive Q&A session followed the core presentations, enabling participants to clarify doubts and engage in knowledge exchange. ` +
        `\n\nConclusion: The event concluded with a vote of thanks, followed by feedback collection from all attendees. The overall capacity utilization was ${stats.capacityUtilization}%.`;

    drawParagraph(briefReport);
    y += 4;

    // ─── 5. Event Photographs ───────────────────────────────────────────
    drawSectionHeader("Event Photographs", 5);

    if (extras.photos && extras.photos.length > 0) {
        extras.photos.forEach((photo, i) => {
            addPageIfNeeded(55);
            try {
                doc.addImage(photo.dataUrl, "JPEG", margin + 5, y, 80, 50);
                doc.setFontSize(8);
                doc.setFont("helvetica", "italic");
                doc.text(photo.caption || `Photo ${i + 1}`, margin + 5, y + 53);
                y += 58;
            } catch {
                drawBullet(`[Photo ${i + 1}: ${photo.caption || "Event photograph"}]`);
            }
        });
    } else {
        drawBullet("[Photo 1: Speaker addressing the audience]");
        drawBullet("[Photo 2: Group photo with participants]");
        drawBullet("[Photo 3: Interaction or hands-on session]");
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(120, 120, 120);
        doc.text("Note: Attach high-quality geotagged photographs before final submission.", margin + 4, y);
        doc.setTextColor(30, 30, 30);
        y += 8;
    }
    y += 4;

    // ─── 6. Feedback Summary ────────────────────────────────────────────
    drawSectionHeader("Feedback Summary", 6);

    drawKeyValue("Overall Satisfaction", extras.feedbackRating || `${stats.attendanceRate}% attendance rate`);
    drawKeyValue("Most Liked Aspect", extras.feedbackBest || "Hands-on practical sessions and expert interactions");
    drawKeyValue("Area for Improvement", extras.feedbackImprove || "Extended session duration and more networking opportunities");
    y += 4;

    // ─── 7. Attendance Record ───────────────────────────────────────────
    drawSectionHeader("Attendance Record", 7);

    if (attendees.length > 0) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Total confirmed attendees: ${attendees.length}`, margin + 2, y);
        y += 6;

        autoTable(doc, {
            startY: y,
            margin: { left: margin, right: margin },
            head: [["#", "Name", "Email", "Checked In", "Check-in Time"]],
            body: attendees.map((a, i) => [
                i + 1,
                a.name,
                a.email,
                a.checkedIn ? "Yes" : "No",
                a.checkedInAt ? formatReportDate(a.checkedInAt) : "—",
            ]),
            styles: {
                fontSize: 8,
                cellPadding: 2,
                lineColor: [200, 200, 200],
                lineWidth: 0.2,
            },
            headStyles: {
                fillColor: [30, 58, 138],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 8.5,
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250],
            },
            theme: "grid",
        });

        y = doc.lastAutoTable.finalY + 8;
    } else {
        drawBullet("No confirmed registrations found for this event.");
    }

    // ─── Footer on every page ───────────────────────────────────────────
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(140, 140, 140);
        doc.text(
            `UniSync Event Report — ${event.title} | Page ${i} of ${totalPages}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 8,
            { align: "center" }
        );
    }

    return doc;
}
