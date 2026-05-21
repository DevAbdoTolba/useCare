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
