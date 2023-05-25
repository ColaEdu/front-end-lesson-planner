import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const printDocument = (documentId)  => {
  const originalElement = document.getElementById(documentId) as HTMLElement;
  console.log('originalElement--', originalElement)
  const cloneElement = originalElement.cloneNode(true);

  // Set the clone element to be large enough to contain all content
  cloneElement.style.height = 'auto';
  cloneElement.style.overflow = 'visible';
  cloneElement.style.position = 'absolute';
  cloneElement.style.left = '-9999px';

  document.body.appendChild(cloneElement);

  html2canvas(cloneElement).then((canvas) => {
    // Convert the canvas to PDF...
    const imgData = canvas.toDataURL('image/png');
    console.log('imgData', imgData)
    const pdf =  new jsPDF('p', 'px', [canvas.width, canvas.height])
    pdf.addImage(imgData, 'PNG', 0,  0, canvas.width,canvas.height);
    pdf.save("download.pdf");
    // Remove the clone element
    document.body.removeChild(cloneElement);
  });

}
