/**
 * Standalone Event Report PDF Generator.
 * Uses jsPDF + jspdf-autotable.
 * Photos and signed approval PDF are embedded into the final output.
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument } from "pdf-lib";
import {
    formatReportDate,
    formatDuration,
    categoryLabel,
    inferSDGs,
    inferPOs,
} from "./report-helpers.js";

/**
 * Generate a complete event report PDF.
 *
 * @param {Object} formData — all form values
 * @param {Array<{dataUrl: string, name: string, gpsText: string}>} photos
 * @param {ArrayBuffer|null} signedPdfBuffer — the signed approval PDF bytes
 * @returns {Promise<void>} — triggers download
 */
export async function generateStandaloneReportPDF(formData, photos, signedPdfBuffer) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // ─── Utility helpers ──────────────────────────────────────────────────
    const addPageIfNeeded = (requiredSpace = 30) => {
        if (y + requiredSpace > pageHeight - 20) {
            doc.addPage();
            y = margin;
        }
    };

    const drawSectionHeader = (title, sectionNum) => {
        addPageIfNeeded(20);
        doc.setFillColor(30, 58, 138);
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

    // ─── Title Block ──────────────────────────────────────────────────────
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

    // ─── 1. Basic Event Details ───────────────────────────────────────────
    drawSectionHeader("Basic Event Details", 1);
    drawKeyValue("Title of the Event", formData.eventTitle);
    drawKeyValue("Type of Event", categoryLabel(formData.eventType));
    drawKeyValue("Organizing Dept/Club", formData.department);
    drawKeyValue(
        "Date & Duration",
        `${formatReportDate(formData.startDate)} to ${formatReportDate(formData.endDate)} (${formatDuration(formData.startDate, formData.endDate)})`
    );
    drawKeyValue("Venue", formData.venue);
    drawKeyValue("Target Participants", formData.targetParticipants || "Students, Faculty, Professionals");
    drawKeyValue(
        "No. of Participants",
        `Registered: ${formData.numRegistered} | Attended: ${formData.numAttended}`
    );
    drawKeyValue("Coordinator(s)", formData.coordinators);
    drawKeyValue("Resource Person(s)", formData.resourcePersons || "N/A");
    y += 4;

    // ─── 2. Event Objectives ──────────────────────────────────────────────
    drawSectionHeader("Event Objectives", 2);
    const objectives = formData.objectives.filter(Boolean);
    if (objectives.length > 0) {
        objectives.forEach((obj) => drawBullet(obj));
    } else {
        drawBullet(`To provide comprehensive knowledge on ${formData.eventTitle}`);
        drawBullet(`To enhance practical skills in ${categoryLabel(formData.eventType)}`);
    }
    y += 2;
    drawKeyValue("SDGs Addressed", inferSDGs(formData.eventType).join("; "));
    drawKeyValue("POs Addressed", inferPOs(formData.eventType).join("; "));
    y += 4;

    // ─── 3. Key Outcomes ──────────────────────────────────────────────────
    drawSectionHeader("Key Outcomes of the Event", 3);
    const outcomes = formData.outcomes.filter(Boolean);
    if (outcomes.length > 0) {
        outcomes.forEach((out) => drawBullet(out));
    } else {
        drawBullet(`Comprehensive understanding of ${formData.eventTitle} concepts`);
        drawBullet("Technical proficiency in tools and technologies discussed");
    }
    y += 4;

    // ─── 4. Brief Report ──────────────────────────────────────────────────
    drawSectionHeader("Brief Report (Detailed Description)", 4);
    drawParagraph(formData.briefReport || "No detailed report provided.");
    y += 4;

    // ─── 5. Event Photographs ─────────────────────────────────────────────
    drawSectionHeader("Event Photographs (Geo-Tagged)", 5);

    if (photos && photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
            const photo = photos[i];
            // Each photo gets max 70mm height + caption space
            addPageIfNeeded(80);
            try {
                // Calculate proportional dimensions — max width 80mm, max height 60mm
                const imgProps = doc.getImageProperties(photo.dataUrl);
                const maxW = 80;
                const maxH = 60;
                const ratio = Math.min(maxW / imgProps.width, maxH / imgProps.height);
                const imgW = imgProps.width * ratio;
                const imgH = imgProps.height * ratio;

                doc.addImage(photo.dataUrl, "JPEG", margin + 5, y, imgW, imgH);

                // Caption with photo number and GPS
                doc.setFontSize(8);
                doc.setFont("helvetica", "italic");
                doc.setTextColor(80, 80, 80);
                let caption = `Photo ${i + 1}: ${photo.name}`;
                if (photo.gpsText) {
                    caption += ` | GPS: ${photo.gpsText}`;
                }
                doc.text(caption, margin + 5, y + imgH + 4);
                doc.setTextColor(30, 30, 30);
                y += imgH + 10;
            } catch {
                drawBullet(`[Photo ${i + 1}: ${photo.name}] — could not embed image`);
            }
        }
    } else {
        drawBullet("[No photographs attached]");
    }
    y += 4;

    // ─── 6. Feedback Summary ──────────────────────────────────────────────
    drawSectionHeader("Feedback Summary", 6);
    drawKeyValue("Overall Satisfaction", formData.feedbackRating || "N/A");
    drawKeyValue("Most Liked Aspect", formData.feedbackBest || "N/A");
    drawKeyValue("Area for Improvement", formData.feedbackImprove || "N/A");
    y += 4;

    // ─── Footer on every page of the jsPDF doc ────────────────────────────
    const jsPdfPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= jsPdfPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(140, 140, 140);
        doc.text(
            `Event Report — ${formData.eventTitle} | Page ${i}`,
            pageWidth / 2,
            pageHeight - 8,
            { align: "center" }
        );
    }

    // ─── Merge signed approval PDF if provided ────────────────────────────
    if (signedPdfBuffer) {
        try {
            // Convert jsPDF output to pdf-lib document
            const jsPdfBytes = doc.output("arraybuffer");
            const mergedPdf = await PDFDocument.load(jsPdfBytes);
            const signedPdf = await PDFDocument.load(signedPdfBuffer);
            const signedPages = await mergedPdf.copyPages(signedPdf, signedPdf.getPageIndices());

            // Add a separator page before signed document
            const separatorPage = mergedPdf.addPage();
            const { width: sepW, height: sepH } = separatorPage.getSize();
            // Draw navy header bar
            separatorPage.drawRectangle({
                x: 0,
                y: sepH - 60,
                width: sepW,
                height: 60,
                color: { type: 'RGB', red: 30 / 255, green: 58 / 255, blue: 138 / 255 },
            });
            // We can't easily draw text with pdf-lib's simple API on the separator,
            // but the signed pages themselves convey the content needed.

            signedPages.forEach((page) => mergedPdf.addPage(page));

            const mergedBytes = await mergedPdf.save();
            const blob = new Blob([mergedBytes], { type: "application/pdf" });
            triggerDownload(blob, `Event_Report_${sanitize(formData.eventTitle)}.pdf`);
            return;
        } catch (err) {
            console.error("Failed to merge signed PDF, downloading report without it:", err);
        }
    }

    // Fallback: download just the jsPDF report
    doc.save(`Event_Report_${sanitize(formData.eventTitle)}.pdf`);
}

function sanitize(str) {
    return (str || "Report").replace(/[^a-zA-Z0-9]/g, "_");
}

function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
    }, 100);
}
