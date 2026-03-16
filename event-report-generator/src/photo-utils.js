/**
 * Photo utility functions — EXIF GPS extraction and file handling.
 */
import ExifReader from "exifreader";

/**
 * Read EXIF data from a File, extracting GPS coordinates if present.
 * @param {File} file
 * @returns {Promise<{lat: number|null, lng: number|null, raw: object|null}>}
 */
export async function readExifData(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const tags = ExifReader.load(arrayBuffer, { expanded: true });

        if (tags.gps && tags.gps.Latitude !== undefined && tags.gps.Longitude !== undefined) {
            return {
                lat: tags.gps.Latitude,
                lng: tags.gps.Longitude,
                raw: tags.gps,
            };
        }
        return { lat: null, lng: null, raw: null };
    } catch {
        return { lat: null, lng: null, raw: null };
    }
}

/**
 * Format GPS coordinates as a DMS string.
 * @param {number} lat
 * @param {number} lng
 * @returns {string}
 */
export function formatGPSCoords(lat, lng) {
    if (lat == null || lng == null) return "";

    function toDMS(dd, isLat) {
        const dir = isLat ? (dd >= 0 ? "N" : "S") : (dd >= 0 ? "E" : "W");
        const abs = Math.abs(dd);
        const d = Math.floor(abs);
        const mFloat = (abs - d) * 60;
        const m = Math.floor(mFloat);
        const s = ((mFloat - m) * 60).toFixed(1);
        return `${d}°${m}'${s}"${dir}`;
    }

    return `${toDMS(lat, true)}, ${toDMS(lng, false)}`;
}

/**
 * Convert a File to a data URL string.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Convert a File to an ArrayBuffer.
 * @param {File} file
 * @returns {Promise<ArrayBuffer>}
 */
export function fileToArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
