/**
 * Main application logic — form handling, photo upload, PDF generation.
 */
import "./style.css";
import { readExifData, formatGPSCoords, fileToDataUrl, fileToArrayBuffer } from "./photo-utils.js";
import { generateStandaloneReportPDF } from "./generate-pdf-report.js";

// ─── State ──────────────────────────────────────────────────────────────────
const state = {
    photos: [],       // { file, dataUrl, gpsText, name }
    signedPdf: null,  // ArrayBuffer
    signedPdfName: "",
};

const MIN_PHOTOS = 2;
const MAX_PHOTOS = 6;

// ─── DOM References ─────────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const form = $("#reportForm");

// Dynamic lists
const objectivesList = $("#objectivesList");
const outcomesList = $("#outcomesList");
const addObjBtn = $("#addObjective");
const addOutBtn = $("#addOutcome");

// Photo upload
const photoUploadArea = $("#photoUploadArea");
const photoInput = $("#photoInput");
const photoPreviewGrid = $("#photoPreviewGrid");
const photoError = $("#photoError");

// PDF upload
const pdfUploadArea = $("#pdfUploadArea");
const pdfInput = $("#pdfInput");
const pdfPreview = $("#pdfPreview");
const pdfFileName = $("#pdfFileName");
const removePdfBtn = $("#removePdf");

// Generate
const generateBtn = $("#generateBtn");

// Toast
const toast = $("#toast");
const toastMsg = $("#toastMsg");

// ─── Dynamic List Logic ─────────────────────────────────────────────────────
function createDynamicItem(listEl, className, placeholder, index) {
    const div = document.createElement("div");
    div.className = "dynamic-item";
    div.innerHTML = `
    <span class="item-num">${index}.</span>
    <input type="text" class="${className}" placeholder="${placeholder}" />
    <button type="button" class="btn-remove" title="Remove">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    </button>
  `;
    listEl.appendChild(div);
    updateRemoveButtons(listEl);
    return div;
}

function updateRemoveButtons(listEl) {
    const items = listEl.querySelectorAll(".dynamic-item");
    items.forEach((item, i) => {
        item.querySelector(".item-num").textContent = `${i + 1}.`;
        const btn = item.querySelector(".btn-remove");
        btn.style.visibility = items.length <= 1 ? "hidden" : "visible";
    });
}

function setupDynamicList(listEl, addBtn, className, placeholder) {
    addBtn.addEventListener("click", () => {
        const count = listEl.querySelectorAll(".dynamic-item").length;
        createDynamicItem(listEl, className, placeholder, count + 1);
    });

    listEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-remove");
        if (!btn) return;
        const item = btn.closest(".dynamic-item");
        if (listEl.querySelectorAll(".dynamic-item").length > 1) {
            item.remove();
            updateRemoveButtons(listEl);
        }
    });
}

setupDynamicList(objectivesList, addObjBtn, "objective-input", "To provide hands-on training in…");
setupDynamicList(outcomesList, addOutBtn, "outcome-input", "Comprehensive understanding of…");

// ─── Photo Upload ───────────────────────────────────────────────────────────
photoUploadArea.addEventListener("click", () => photoInput.click());
photoUploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    photoUploadArea.classList.add("dragover");
});
photoUploadArea.addEventListener("dragleave", () => {
    photoUploadArea.classList.remove("dragover");
});
photoUploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    photoUploadArea.classList.remove("dragover");
    handlePhotoFiles(e.dataTransfer.files);
});
photoInput.addEventListener("change", () => {
    handlePhotoFiles(photoInput.files);
    photoInput.value = "";
});

async function handlePhotoFiles(fileList) {
    const files = Array.from(fileList).filter((f) =>
        f.type.startsWith("image/")
    );

    if (state.photos.length + files.length > MAX_PHOTOS) {
        showPhotoError(`Maximum ${MAX_PHOTOS} photos allowed. You already have ${state.photos.length}.`);
        return;
    }

    hidePhotoError();

    for (const file of files) {
        if (state.photos.length >= MAX_PHOTOS) break;

        const [dataUrl, gps] = await Promise.all([
            fileToDataUrl(file),
            readExifData(file),
        ]);

        const gpsText =
            gps.lat != null && gps.lng != null
                ? formatGPSCoords(gps.lat, gps.lng)
                : "";

        state.photos.push({
            file,
            dataUrl,
            gpsText,
            name: file.name,
        });
    }

    renderPhotoGrid();
}

function renderPhotoGrid() {
    photoPreviewGrid.innerHTML = "";

    state.photos.forEach((photo, i) => {
        const card = document.createElement("div");
        card.className = "photo-card";
        card.innerHTML = `
      <img src="${photo.dataUrl}" alt="${photo.name}" />
      <div class="photo-info">
        <div class="photo-name">${photo.name}</div>
        <div class="photo-gps ${photo.gpsText ? "" : "no-gps"}">
          ${photo.gpsText ? `📍 ${photo.gpsText}` : "No GPS data"}
        </div>
      </div>
      <button type="button" class="btn-remove-photo" data-index="${i}" title="Remove photo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
      </button>
    `;
        photoPreviewGrid.appendChild(card);
    });

    // Attach remove handlers
    photoPreviewGrid.querySelectorAll(".btn-remove-photo").forEach((btn) => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index, 10);
            state.photos.splice(idx, 1);
            renderPhotoGrid();
        });
    });
}

function showPhotoError(msg) {
    photoError.textContent = msg;
    photoError.hidden = false;
}
function hidePhotoError() {
    photoError.hidden = true;
}

// ─── PDF Upload ──────────────────────────────────────────────────────────────
pdfUploadArea.addEventListener("click", () => pdfInput.click());
pdfUploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    pdfUploadArea.classList.add("dragover");
});
pdfUploadArea.addEventListener("dragleave", () => {
    pdfUploadArea.classList.remove("dragover");
});
pdfUploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    pdfUploadArea.classList.remove("dragover");
    const file = Array.from(e.dataTransfer.files).find((f) => f.type === "application/pdf");
    if (file) handlePdfFile(file);
});
pdfInput.addEventListener("change", () => {
    if (pdfInput.files[0]) handlePdfFile(pdfInput.files[0]);
    pdfInput.value = "";
});

async function handlePdfFile(file) {
    state.signedPdf = await fileToArrayBuffer(file);
    state.signedPdfName = file.name;
    pdfFileName.textContent = file.name;
    pdfPreview.hidden = false;
    pdfUploadArea.style.display = "none";
}

removePdfBtn.addEventListener("click", () => {
    state.signedPdf = null;
    state.signedPdfName = "";
    pdfPreview.hidden = true;
    pdfUploadArea.style.display = "";
});

// ─── Form Submission ─────────────────────────────────────────────────────────
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate photo count
    if (state.photos.length < MIN_PHOTOS) {
        showPhotoError(`Please upload at least ${MIN_PHOTOS} photographs.`);
        photoUploadArea.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    // Collect form data
    const formData = {
        eventTitle: $("#eventTitle").value.trim(),
        eventType: $("#eventType").value,
        department: $("#department").value.trim(),
        startDate: $("#startDate").value,
        endDate: $("#endDate").value,
        venue: $("#venue").value.trim(),
        targetParticipants: $("#targetParticipants").value.trim(),
        numRegistered: $("#numRegistered").value,
        numAttended: $("#numAttended").value,
        coordinators: $("#coordinators").value.trim(),
        resourcePersons: $("#resourcePersons").value.trim(),
        objectives: Array.from(document.querySelectorAll(".objective-input")).map((el) => el.value.trim()),
        outcomes: Array.from(document.querySelectorAll(".outcome-input")).map((el) => el.value.trim()),
        briefReport: $("#briefReport").value.trim(),
        feedbackRating: $("#feedbackRating").value.trim(),
        feedbackBest: $("#feedbackBest").value.trim(),
        feedbackImprove: $("#feedbackImprove").value.trim(),
    };

    // Show loading
    generateBtn.disabled = true;
    const originalHTML = generateBtn.innerHTML;
    generateBtn.innerHTML = `<div class="spinner"></div> Generating…`;

    try {
        await generateStandaloneReportPDF(formData, state.photos, state.signedPdf);
        showToast("Report PDF downloaded successfully!", "success");
    } catch (err) {
        console.error("Report generation failed:", err);
        showToast("Failed to generate report. Check console for details.", "error");
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = originalHTML;
    }
});

// ─── Toast ───────────────────────────────────────────────────────────────────
let toastTimeout;
function showToast(msg, type = "success") {
    clearTimeout(toastTimeout);
    toastMsg.textContent = msg;
    toast.className = `toast ${type} show`;
    toast.hidden = false;
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.hidden = true;
        }, 300);
    }, 4000);
}
