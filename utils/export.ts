
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, Header, Footer, PageNumber } from 'docx';

// Extend jsPDF interface to include autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable(options: {
      startY: number;
      head: string[][];
      body: (string | number)[][];
      theme?: string;
      styles?: Record<string, unknown>;
      headStyles?: Record<string, unknown>;
      margin?: { left?: number; right?: number };
      rowPageBreak?: string;
    }): void;
    lastAutoTable: { finalY: number };
  }
}

interface TableData {
  type: 'table';
  headers: string[];
  rows: (string | number)[][];
}

interface ImageData {
  type: 'image';
  dataUrl: string;
  width: number;
  height: number;
}

export interface ReportSection {
  title: string;
  content: (string | TableData | ImageData)[];
  orientation?: 'portrait' | 'landscape';
}

export interface ReportData {
  title: string;
  sections: ReportSection[];
}

const ORG_NAME = "Independent State of Papua New Guinea";
const CUSTODIAN = "System Custodian: Department of Personnel Management (DPM)";
const NAVY_COLOR = [26, 54, 93]; // #1A365D

const createFileName = (title: string, extension: string) => {
    const sanitizedTitle = title.toLowerCase().replace(/\s+/g, '-');
    return `${sanitizedTitle}-official-report-${new Date().toISOString().split('T')[0]}.${extension}`;
};

// --- PDF EXPORT (Succession Plan Standard) ---
export const exportToPdf = (reportData: ReportData) => {
    const doc = new jsPDF(reportData.sections[0]?.orientation || 'portrait', 'mm');

    const addOfficialHeader = (d: jsPDF, pageTitle: string) => {
        const pageWidth = d.internal.pageSize.getWidth();
        // National Crest Placeholder
        d.setDrawColor(26, 54, 93).setLineWidth(0.5);
        d.circle(pageWidth / 2, 15, 10, 'S');
        d.setFontSize(6).setTextColor(100).text("CREST", pageWidth / 2, 16, { align: 'center' });

        d.setFont("helvetica", "bold").setFontSize(11).setTextColor(26, 54, 93);
        d.text(ORG_NAME.toUpperCase(), pageWidth / 2, 32, { align: 'center' });
        
        d.setFontSize(15).text(pageTitle.toUpperCase(), pageWidth / 2, 42, { align: 'center' });
        return 55; // Y content start
    };

    const addFooter = (d: jsPDF) => {
        const totalPages = d.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            d.setPage(i);
            const pageWidth = d.internal.pageSize.getWidth();
            const pageHeight = d.internal.pageSize.getHeight();
            d.setDrawColor(26, 54, 93).setLineWidth(0.3).line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
            d.setFont("helvetica", "bold").setFontSize(8).setTextColor(100);
            d.text(CUSTODIAN, 15, pageHeight - 10);
            d.text(`Official Document - Page ${i} of ${totalPages}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
        }
    };

    let y = addOfficialHeader(doc, reportData.title);

    reportData.sections.forEach((section, sIndex) => {
        if (sIndex > 0) {
            doc.addPage(section.orientation || 'portrait');
            y = addOfficialHeader(doc, reportData.title);
        }

        doc.setFont("helvetica", "bold").setFontSize(13).setTextColor(26, 54, 93).text(section.title.toUpperCase(), 15, y);
        y += 10;

        section.content.forEach(item => {
            if (typeof item === 'string') {
                doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(50);
                const lines = doc.splitTextToSize(item, doc.internal.pageSize.getWidth() - 30);
                if (y + (lines.length * 5) > doc.internal.pageSize.getHeight() - 25) {
                    doc.addPage(section.orientation || 'portrait');
                    y = addOfficialHeader(doc, reportData.title);
                }
                doc.text(lines, 15, y);
                y += (lines.length * 5) + 10;
            } else if (item.type === 'table') {
                doc.autoTable({
                    startY: y,
                    head: [item.headers],
                    body: item.rows,
                    theme: 'grid',
                    styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
                    headStyles: { fillColor: NAVY_COLOR, textColor: [255, 255, 255], fontStyle: 'bold' },
                    margin: { left: 15, right: 15 },
                    rowPageBreak: 'auto'
                });
                y = doc.lastAutoTable.finalY + 12;
            } else if (item.type === 'image') {
                if (y + item.height > doc.internal.pageSize.getHeight() - 25) {
                    doc.addPage(section.orientation || 'portrait');
                    y = addOfficialHeader(doc, reportData.title);
                }
                doc.addImage(item.dataUrl, 'PNG', 15, y, item.width, item.height);
                y += item.height + 10;
            }
        });
    });

    addFooter(doc);
    doc.save(createFileName(reportData.title, 'pdf'));
};

// --- DOCX EXPORT (Government Template Alignment) ---
export const exportToDocx = (reportData: ReportData) => {

    const docSections = reportData.sections.map((section) => {
        const content = section.content.flatMap(item => {
            if (typeof item === 'string') {
                return item.split('\n').map(line => new Paragraph({ children: [new TextRun({ text: line, size: 20 })], spacing: { after: 120 } }));
            } else if (item.type === 'table') {
                return new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({ children: item.headers.map(h => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })], shading: { fill: "1A365D" } })) }),
                        ...item.rows.map(row => new TableRow({ children: row.map(cell => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(cell ?? ''), size: 18 })] })] })) })),
                    ],
                });
            }
            return [];
        });

        return {
            properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: ORG_NAME.toUpperCase(), bold: true, size: 22, color: "1A365D" })], alignment: AlignmentType.CENTER })] }) },
            footers: { default: new Footer({ children: [new Paragraph({ children: [new TextRun({ text: CUSTODIAN, size: 16 }), new TextRun({ text: "\t\tOfficial Document - Page ", size: 16 }), new TextRun({ children: [PageNumber.CURRENT], size: 16 }), new TextRun({ text: " of ", size: 16 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16 })], alignment: AlignmentType.LEFT })] }) },
            children: [new Paragraph({ children: [new TextRun({ text: section.title, bold: true, size: 28, color: "1A365D" })], spacing: { before: 400, after: 200 } }), ...content]
        };
    });

    Packer.toBlob(new Document({ sections: docSections })).then((blob: Blob) => {
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = createFileName(reportData.title, 'docx'); a.click();
    });
};

// --- XLSX EXPORT (Full Integrity) ---
export const exportToXlsx = async (reportData: ReportData) => {
    const wb = new ExcelJS.Workbook();
    reportData.sections.forEach(section => {
        const table = section.content.find(c => typeof c !== 'string' && c.type === 'table') as TableData | undefined;
        if (table) {
            const ws = wb.addWorksheet(section.title.substring(0, 31));
            ws.addRow(table.headers);
            table.rows.forEach(row => ws.addRow(row));
            ws.columns = table.headers.map((_, i) => ({ width: i === table.headers.length - 1 ? 60 : 25 }));
        }
    });
    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = createFileName(reportData.title, 'xlsx');
    a.click();
};

export const exportToCsv = (reportData: ReportData) => {
    const table = reportData.sections.flatMap(s => s.content).find(c => typeof c !== 'string' && c.type === 'table') as TableData | undefined;
    if (!table) return;
    const csvContent = [table.headers.join(','), ...table.rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv' })); a.download = createFileName(reportData.title, 'csv'); a.click();
};

export const copyForSheets = (reportData: ReportData): Promise<string> => {
    const table = reportData.sections.flatMap(s => s.content).find(c => typeof c !== 'string' && c.type === 'table') as TableData | undefined;
    if (!table) return Promise.reject("No table data.");
    const tsv = [table.headers.join('\t'), ...table.rows.map(r => r.join('\t'))].join('\n');
    return navigator.clipboard.writeText(tsv).then(() => "Official Table copied to clipboard.");
}

export const exportToJson = (data: Record<string, unknown>) => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); a.download = createFileName((data.title as string) || 'export', 'json'); a.click();
};
