import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

export interface QRContent {
  id: string;
  hash: string;
  status: string;
  expiry: string;
}

export class QRGenerator {
  static async generateQRContent(data: QRContent): Promise<string> {
    const content = JSON.stringify({
      id: data.id,
      hash: data.hash,
      status: data.status,
      expiry: data.expiry
    });
    return await QRCode.toDataURL(content, { width: 300 });
  }

  static async generateStickerPDF(
    inhalers: Array<{ id: string; qrDataUrl: string; type: string; expiry: string }>
  ): Promise<Buffer> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const stickerWidth = 70;
    const stickerHeight = 50;
    const margin = 10;
    const cols = Math.floor((pageWidth - 2 * margin) / stickerWidth);
    const rows = Math.floor((pageHeight - 2 * margin) / stickerHeight);

    let x = margin;
    let y = margin;
    let stickerIndex = 0;

    for (const inhaler of inhalers) {
      if (stickerIndex > 0 && stickerIndex % (cols * rows) === 0) {
        doc.addPage();
        x = margin;
        y = margin;
      }

      // Add border
      doc.setDrawColor(0);
      doc.rect(x, y, stickerWidth, stickerHeight);

      // Add QR code
      if (inhaler.qrDataUrl) {
        doc.addImage(inhaler.qrDataUrl, 'PNG', x + 5, y + 5, 25, 25);
      }

      // Add inhaler info
      doc.setFontSize(8);
      doc.text(`ID: ${inhaler.id}`, x + 35, y + 10);
      doc.text(`Type: ${inhaler.type}`, x + 35, y + 15);
      doc.text(`Expiry: ${inhaler.expiry}`, x + 35, y + 20);
      doc.text('VIX - Verified Inhaler Exchange', x + 5, y + 45);

      // Move to next position
      const col = stickerIndex % cols;
      const row = Math.floor(stickerIndex / cols) % rows;

      if (col === cols - 1) {
        x = margin;
        y += stickerHeight + 5;
      } else {
        x += stickerWidth + 5;
      }

      stickerIndex++;
    }

    return doc.output('arraybuffer');
  }

  static parseQRContent(content: string): QRContent {
    try {
      const parsed = JSON.parse(content);
      return {
        id: parsed.id,
        hash: parsed.hash,
        status: parsed.status,
        expiry: parsed.expiry
      };
    } catch (error) {
      throw new Error('Invalid QR code content');
    }
  }
}