const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');
const CourseCertificate = require('../../../models/dashboard/user_courses/user_certificate/courseCertificate'); // Załóżmy, że taki model istnieje
const courseModel = require('../../../models/dashboard/user_courses/courseModel')

const generateCertificate = async (courseCertificate) => {
  try {
       const pdfPath = path.join(__dirname, '../../../assets/cert.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);

    const font = await pdfDoc.embedFont(fs.readFileSync(path.join(__dirname, '../../../assets/fonts/Montserrat-Light.ttf')));
    const Boldfont = await pdfDoc.embedFont(fs.readFileSync(path.join(__dirname, '../../../assets/fonts/Montserrat-Bold.ttf')));
    const Italicfont = await pdfDoc.embedFont(fs.readFileSync(path.join(__dirname, '../../../assets/fonts/Montserrat-Italic.ttf')));

    const getStringWidth = (string, fontSize) => font.widthOfTextAtSize(string, fontSize);


    const pages = pdfDoc.getPages();
    const page = pages[0];
    const PAGE_WIDTH = page.getWidth();
    const PAGE_HEIGHT = page.getHeight();

    // Teksty z CourseCertificate
    const { courseName, userName, date, courseId, userId } = courseCertificate;
    const textLine1 = `"${courseName}"`;
  //  const textLine2 = 'schematów podatkowych"';
    const textLine3 = 'przeprowadzone przez';
    const textLine4 = 'dotlaw Skrzywanek Stępniowski i Wspólnicy sp. k.';

    const fontSize = 12;
    const textYPosition = PAGE_HEIGHT - 540; // Ajusted starting Y position for text

    const drawText = (text, options) => {
      const { font, size, yPositionOffset, color = rgb(0, 0, 0) } = options;
      const textWidth = getStringWidth(text, size);
      const textXPosition = (PAGE_WIDTH - textWidth) / 2;
      page.drawText(text, {
        font,
        size,
        color,
        x: textXPosition,
        y: textYPosition - yPositionOffset,
      });
    };

    // Drawing the text on the PDF
    drawText(textLine1, { font: Italicfont, size: fontSize, yPositionOffset: 0 });
    //drawText(textLine2, { font: Italicfont, size: fontSize, yPositionOffset: fontSize * 1.5 });
    drawText(textLine3, { font, size: fontSize, yPositionOffset: fontSize * 3 });
    drawText(textLine4, { font: Boldfont, size: fontSize, yPositionOffset: fontSize * 4.5, color: rgb(0.50, 0.35, 0.97) });
    drawText(userName, { font, size: 29, yPositionOffset: -100 });

    const drawDate = (text, options) => {
        const { font, size, rightMargin, bottomMargin, color = rgb(0, 0, 0) } = options;
        const textWidth = getStringWidth(text, size);
        const textXPosition = PAGE_WIDTH - textWidth - rightMargin; // Obliczanie pozycji x z uwzględnieniem marginesu prawego
        const textYPosition = bottomMargin; // Ustawienie y na stałą wartość marginesu dolnego
        page.drawText(text, {
          font,
          size,
          color,
          x: textXPosition,
          y: textYPosition,
        });
      };
      
      // Przykładowe użycie dla daty w prawym dolnym rogu
      // Assuming 'date' is already formatted as 'Wrocław, <actual-date>'
drawDate(`Wrocław, ${date}`, { font, size: 12, rightMargin: 145, bottomMargin: 140 });

      
    const pdfBytesOut = await pdfDoc.save();
    await courseModel.saveCertificateBlob(userId, courseId, pdfBytesOut);
    return pdfBytesOut;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate PDF');
  }
};

module.exports = { generateCertificate };
