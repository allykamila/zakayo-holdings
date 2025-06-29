import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Generate PDF from HTML element
export const generatePDFFromElement = async (
  element: HTMLElement,
  fileName: string
) => {
  try {
    // Create canvas from the DOM element
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    // Document dimensions based on A4 paper
    const imgWidth = 210; // A4 width in mm
    const pixelRatio = canvas.width / canvas.height;
    const imgHeight = imgWidth / pixelRatio;

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");

    // Add image to PDF
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Save the PDF
    pdf.save(fileName);

    return { success: true };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return { success: false, error };
  }
};

// Share via WhatsApp (creates a WhatsApp link with predefined text)
export const shareViaWhatsApp = (phoneNumber: string, message: string) => {
  // Format phone number to international format without '+' or spaces
  const formattedNumber = phoneNumber.replace(/\D/g, "");

  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(
    message
  )}`;

  // Open WhatsApp in new window
  window.open(whatsappUrl, "_blank");
};
