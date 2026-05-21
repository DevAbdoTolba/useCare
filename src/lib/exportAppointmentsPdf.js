import { jsPDF } from 'jspdf';
import { timeLabel } from './format.js';

/**
 * Export a list of appointments to a PDF (preserves Samir's jsPDF feature,
 * kept out of the page component as a small reusable util).
 *
 * @param {Array} appointments - rows to print (already filtered)
 * @param {(id:number)=>string} nameOf - resolve a user id to a display name
 */
export function exportAppointmentsPdf(appointments, nameOf) {
  const doc = new jsPDF();
  const cols = { date: 14, time: 50, patient: 80, doctor: 130, status: 175 };

  doc.setFontSize(16);
  doc.text('useCare — Appointments', 14, 18);

  doc.setFontSize(10);
  let y = 30;
  doc.text('Date', cols.date, y);
  doc.text('Time', cols.time, y);
  doc.text('Patient', cols.patient, y);
  doc.text('Doctor', cols.doctor, y);
  doc.text('Status', cols.status, y);
  doc.setLineWidth(0.2);
  doc.line(14, y + 2, 196, y + 2);
  y += 9;

  appointments.forEach((a) => {
    if (y > 285) {
      doc.addPage();
      y = 20;
    }
    doc.text(String(a.date ?? ''), cols.date, y);
    doc.text(a.time ? timeLabel(a.time) : '', cols.time, y);
    doc.text(nameOf(a.patient_id), cols.patient, y);
    doc.text(nameOf(a.doctor_id), cols.doctor, y);
    doc.text(String(a.status ?? ''), cols.status, y);
    y += 7;
  });

  doc.save('usecare-appointments.pdf');
}

// PDF look per site theme (read from localStorage 'usecare_theme').
const THEME_STYLE = {
  default: { font: 'helvetica', headerBg: [33, 33, 33], headerText: [255, 255, 255], accent: [33, 33, 33] },
  glass: { font: 'helvetica', headerBg: [10, 132, 255], headerText: [255, 255, 255], accent: [10, 132, 255] },
  vintage: { font: 'times', headerBg: [111, 78, 55], headerText: [245, 239, 225], accent: [111, 78, 55] },
};

function currentThemeKey() {
  try {
    const k = localStorage.getItem('usecare_theme');
    return THEME_STYLE[k] ? k : 'default';
  } catch {
    return 'default';
  }
}

/**
 * Export a SINGLE appointment as a nicely formatted PDF whose styling follows
 * the site theme currently selected in localStorage (default / glass / vintage).
 *
 * @param {object} appt - the appointment
 * @param {{patientName:string, doctorName:string, specialtyName:string}} info
 */
export function exportSingleAppointmentPdf(appt, info) {
  const style = THEME_STYLE[currentThemeKey()];
  const doc = new jsPDF();

  // Header band
  doc.setFillColor(...style.headerBg);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(...style.headerText);
  doc.setFont(style.font, 'bold');
  doc.setFontSize(20);
  doc.text('useCare — Appointment', 14, 18);

  // Detail rows
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  let y = 46;
  const row = (label, val) => {
    doc.setFont(style.font, 'bold');
    doc.text(`${label}:`, 16, y);
    doc.setFont(style.font, 'normal');
    doc.text(String(val ?? '—'), 62, y);
    y += 11;
  };
  row('Date', appt.date);
  row('Time', appt.time ? timeLabel(appt.time) : '');
  row('Patient', info.patientName);
  row('Doctor', info.doctorName);
  row('Specialty', info.specialtyName);
  row('Status', appt.status);

  // Notes
  y += 4;
  doc.setDrawColor(...style.accent);
  doc.setLineWidth(0.5);
  doc.line(16, y, 194, y);
  y += 10;
  doc.setFont(style.font, 'bold');
  doc.text("Doctor's note", 16, y);
  y += 9;
  doc.setFont(style.font, 'normal');
  const note = appt.notes?.trim() ? appt.notes : 'No note recorded.';
  doc.text(doc.splitTextToSize(note, 178), 16, y);

  doc.save(`appointment_${appt.id}.pdf`);
}
