import { jsPDF } from 'jspdf';
import { Product } from '../data/products';

interface ScoreSet {
  vata: number;
  pitta: number;
  kapha: number;
}

export const generateReportPDF = (
  dominantDosha: string,
  subtitle: string,
  description: string,
  scores: ScoreSet,
  recommendedProducts: Product[]
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Color Palette Constants
  const cPrimary = [44, 27, 16]; // #2c1b10 - Deep Warm Charcoal
  const cAccent = [138, 90, 54]; // #8a5a36 - Warm Amber
  const cBody = [70, 70, 70];    // Slate body
  const cVata = [180, 110, 30]; // Earthy gold
  const cPitta = [225, 70, 50]; // Rose red
  const cKapha = [10, 130, 80];  // Emerald green

  const marginX = 20;
  const printableWidth = 170; // 210 - 40
  let currentY = 18;

  // --- HELPER WRAPPER FOR TEXT ---
  const addWrappedText = (
    text: string, 
    x: number, 
    y: number, 
    maxWidth: number, 
    lineHeight: number, 
    align: 'left' | 'center' = 'left'
  ) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      if (align === 'center') {
        doc.text(line, x + maxWidth / 2, y, { align: 'center' });
      } else {
        doc.text(line, x, y);
      }
      y += lineHeight;
    });
    return y;
  };

  // --- PAGE 1: CONSTITUTION DETAILS & DOSHA STATUS ---
  
  // Double Golden-Beige Border Frame around page 1
  doc.setDrawColor(218, 204, 182); // soft gold
  doc.setLineWidth(0.8);
  doc.rect(10, 10, 190, 277);
  doc.setLineWidth(0.25);
  doc.rect(11.5, 11.5, 187, 274);

  // Elegant Header
  doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('MANGALAM AYURVEDA AUSHADH BHANDAR', 105, currentY, { align: 'center' });
  currentY += 5.5;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(cAccent[0], cAccent[1], cAccent[2]);
  doc.text('TRADITIONAL SOUTH RISHIKESH PHARMACY  |  ESTD. 1974', 105, currentY, { align: 'center' });
  currentY += 7.5;

  // Divider Line
  doc.setDrawColor(138, 90, 54);
  doc.setLineWidth(0.5);
  doc.line(marginX, currentY, 190, currentY);
  currentY += 8;

  // Report Main Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
  doc.text('NADI PARIKSHA CONSTITUTIONAL ASSESSMENT', 105, currentY, { align: 'center' });
  currentY += 5;

  doc.setFont('Helvetica', 'oblique');
  doc.setFontSize(8);
  doc.text('An authentic analysis of Tridosha bio-energetics and physical indicators', 105, currentY, { align: 'center' });
  currentY += 10;

  // Patient Info section
  doc.setFillColor(250, 248, 244); // light beige card
  doc.rect(marginX, currentY, printableWidth, 18, 'F');
  doc.setDrawColor(230, 225, 215);
  doc.rect(marginX, currentY, printableWidth, 18, 'S');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
  doc.text('Client State:', marginX + 5, currentY + 6);
  doc.text('Date of Evaluation:', marginX + 110, currentY + 6);
  doc.text('Assessing Clinic:', marginX + 5, currentY + 12);
  doc.text('Chief Vaidya Signoff:', marginX + 110, currentY + 12);

  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(cBody[0], cBody[1], cBody[2]);
  doc.text('Anonymous Self-Assessment', marginX + 28, currentY + 6);
  doc.text(new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }), marginX + 140, currentY + 6);
  doc.text('Mangalam Online Diagnostic (Rishikesh, UK)', marginX + 32, currentY + 12);
  doc.text('Dr. S. C. Gaur (Gurukul Kangri)', marginX + 145, currentY + 12);

  currentY += 26;

  // 1. Dominant Dosha Card
  doc.setFillColor(252, 250, 246);
  doc.setDrawColor(138, 90, 54);
  doc.setLineWidth(0.4);
  doc.rect(marginX, currentY, printableWidth, 42, 'F');
  doc.rect(marginX, currentY, printableWidth, 42, 'S');

  // Badge decoration
  doc.setFillColor(138, 90, 54);
  doc.rect(marginX + 5, currentY + 4, 30, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CALCULATED VITALITY', marginX + 20, currentY + 7.5, { align: 'center' });

  // Main Dosha Header
  doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`${dominantDosha.toUpperCase()} CONSTITUTION`, marginX + 5, currentY + 16);

  // Subtitle
  doc.setTextColor(cAccent[0], cAccent[1], cAccent[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(subtitle ? subtitle.toUpperCase() : 'AIR, WATER, & SPACE BALANCE', marginX + 5, currentY + 21);

  // Description
  doc.setTextColor(cBody[0], cBody[1], cBody[2]);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  addWrappedText(description, marginX + 5, currentY + 26, printableWidth - 10, 4);

  currentY += 50;

  // 2. Dosha Score Breakdown Section
  doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('DYNAMIC TRIDOSHA DISTRIBUTION SCALE', marginX, currentY);
  currentY += 5.5;

  // Progress Bar Helper
  const drawScoreBar = (label: string, score: number, color: number[], y: number) => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(cBody[0], cBody[1], cBody[2]);
    doc.text(label, marginX, y);
    doc.text(`${score} / 5 Response Weight`, marginX + printableWidth - 38, y);

    const barWidth = 100;
    const barHeight = 2.5;
    const barX = marginX + 32;
    const barY = y - 2;

    // Background bar
    doc.setFillColor(235, 230, 222);
    doc.rect(barX, barY, barWidth, barHeight, 'F');

    // Foreground score bar
    const filledWidth = (score / 5) * barWidth;
    if (filledWidth > 0) {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(barX, barY, filledWidth, barHeight, 'F');
    }
  };

  drawScoreBar('Vata (Air / Space)', scores.vata, cVata, currentY);
  currentY += 7.5;
  drawScoreBar('Pitta (Fire / Water)', scores.pitta, cPitta, currentY);
  currentY += 7.5;
  drawScoreBar('Kapha (Earth / Water)', scores.kapha, cKapha, currentY);
  currentY += 12;

  // Vaidya comment/notice
  doc.setFillColor(254, 252, 248);
  doc.setDrawColor(218, 204, 182);
  doc.rect(marginX, currentY, printableWidth, 18, 'F');
  doc.rect(marginX, currentY, printableWidth, 18, 'S');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
  doc.text('Important Shastra Guidance:', marginX + 3.5, currentY + 5);

  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(cBody[0], cBody[1], cBody[2]);
  doc.setFontSize(7.5);
  const advice = 'A classical formulation acts as an external bio-modulator. To successfully align your dominant constitution, integrate the compiled recipes below alongside the appropriate carriers like warm milk, ginger infusion, or raw mountain honey.';
  addWrappedText(advice, marginX + 3.5, currentY + 8.5, printableWidth - 7, 3.5);

  currentY += 26;

  // Footer page 1
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(cAccent[0], cAccent[1], cAccent[2]);
  doc.text('MANGALAM AYURVEDA HERITAGE COMPOUNDING PHARMACY  |  ONLINE RECONSTRUCTION & CONSULTATION SYSTEM', 105, 280, { align: 'center' });

  // Add Page 2
  doc.addPage();

  // Reset Y for Page 2
  currentY = 18;

  // Double Border on Page 2
  doc.setDrawColor(218, 204, 182);
  doc.setLineWidth(0.8);
  doc.rect(10, 10, 190, 277);
  doc.setLineWidth(0.25);
  doc.rect(11.5, 11.5, 187, 274);

  // Page 2 Title
  doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CUSTOM PHARMACEUTICAL & REMEDIAL SHEET', 105, currentY, { align: 'center' });
  currentY += 5;

  doc.setFont('Helvetica', 'oblique');
  doc.setFontSize(8);
  doc.setTextColor(cAccent[0], cAccent[1], cAccent[2]);
  doc.text(`Prescribed compounds recommended for a dominantly ${dominantDosha} physiological state`, 105, currentY, { align: 'center' });
  currentY += 10;

  // Section 3 Header: Formulations
  doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('RECOMMENDED REMEDIES & DOCTOR ADMINISTRATION', marginX, currentY);
  currentY += 6;

  // List products
  recommendedProducts.forEach((product, pIndex) => {
    // Light bounding box for each product card
    doc.setFillColor(253, 252, 249);
    doc.setDrawColor(230, 222, 210);
    doc.rect(marginX, currentY, printableWidth, 34, 'F');
    doc.rect(marginX, currentY, printableWidth, 34, 'S');

    // Product Title Line
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
    doc.text(`${pIndex + 1}. ${product.name.toUpperCase()} (${product.sanskritName})`, marginX + 4, currentY + 6);

    // Badge for category
    doc.setFillColor(242, 232, 217);
    doc.rect(marginX + printableWidth - 36, currentY + 3.5, 32, 4.5, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(cAccent[0], cAccent[1], cAccent[2]);
    doc.text(product.category.toUpperCase(), marginX + printableWidth - 20, currentY + 6.5, { align: 'center' });

    // Details content
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(cAccent[0], cAccent[1], cAccent[2]);
    doc.text('Primary Uses / Indications:', marginX + 4, currentY + 12);
    doc.text('Standard Administration & Dosage:', marginX + 4, currentY + 16);
    doc.text('Compounded Action / Description:', marginX + 4, currentY + 20);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(cBody[0], cBody[1], cBody[2]);
    doc.text(product.indications.join(', '), marginX + 42, currentY + 12);
    doc.text(`${product.dosage} (${product.administration})`, marginX + 52, currentY + 16);
    
    // Wrapped description
    addWrappedText(product.description, marginX + 4, currentY + 23, printableWidth - 8, 3.2);

    currentY += 39;
  });

  // Section 4: Vaidya Verification Sign-Off
  currentY += 4;
  doc.setDrawColor(220, 210, 195);
  doc.setLineWidth(0.4);
  doc.line(marginX, currentY, 190, currentY);
  currentY += 8;

  // Left part: Support Coordination
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
  doc.text('MANGALAM CLINICAL HERITAGE DESK', marginX, currentY);
  currentY += 4.5;
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(cBody[0], cBody[1], cBody[2]);
  doc.text('• Rishikesh Pharmacy Helpline: 9258240603', marginX, currentY);
  currentY += 3.5;
  doc.text('• Google Meet virtual consulting space is enabled within the applet.', marginX, currentY);
  currentY += 3.5;
  doc.text('• Register with your calculated score to confirm compounding schedules.', marginX, currentY);

  // Right part: Signature Stamp (Drawn mock)
  const sigX = 135;
  const sigY = 227;

  doc.setDrawColor(138, 90, 54, 0.4);
  doc.setFillColor(252, 250, 246);
  doc.rect(sigX, sigY, 45, 26, 'F');
  doc.rect(sigX, sigY, 45, 26, 'S');

  doc.setTextColor(cAccent[0], cAccent[1], cAccent[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('AUTHENTIC PHARMACY', sigX + 22.5, sigY + 5, { align: 'center' });
  
  doc.setFont('Helvetica', 'oblique');
  doc.setFontSize(8.5);
  doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
  doc.text('Dr. S. C. Gaur', sigX + 22.5, sigY + 13, { align: 'center' });

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(cBody[0], cBody[1], cBody[2]);
  doc.text('Traditional Shastra Certified', sigX + 22.5, sigY + 19, { align: 'center' });
  doc.text('Rishikesh (Uttarakhand)', sigX + 22.5, sigY + 23, { align: 'center' });

  // Page 2 Footer
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(cAccent[0], cAccent[1], cAccent[2]);
  doc.text('MANGALAM AYURVEDA HERITAGE COMPOUNDING PHARMACY  |  ONLINE RECONSTRUCTION & CONSULTATION SYSTEM', 105, 280, { align: 'center' });

  // Trigger browser download of PDF
  const safeFilename = `Tridosha_${dominantDosha}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(safeFilename);
  return doc;
};
