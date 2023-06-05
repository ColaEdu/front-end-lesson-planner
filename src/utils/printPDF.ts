import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// 对象存储链接
async function loadFont(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const font = new Uint8Array(arrayBuffer);
  return font
  const decoder = new TextDecoder();
  const fontAsString = decoder.decode(font);
  console.log('fontAsString--', fontAsString)
  return fontAsString;
}

//http://rvq2pmrrg.hn-bkt.clouddn.com/%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91.ttf
export const printDocument = async (htmlString) => {
  //  jsPDF不支持中文字符，需要添加字符
  // ttf文件过大，故需云服务缓存ttf,
  const doc = new jsPDF();
  // const font = await loadFont("http://rvq2pmrrg.hn-bkt.clouddn.com/NotoSansSC-Regular.otf");
  // doc.addFileToVFS("yahei.ttf", font);
  // doc.addFont("yahei.ttf", "yahei", "normal");

  /**
   * 通过html2canvas截图，存在截图不清晰的问题
   */

  const parser = new DOMParser();
  const textEl = parser.parseFromString(htmlString, 'text/html');
  const element = textEl.body.firstChild;
  // Add the element to the document
  document.body.appendChild(element);
  console.log('element---', element)


  html2canvas(element).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');

    // Create a new A4 PDF
    const pdf = new jsPDF('p', 'mm', 'a4');

    // A4 paper dimensions are 210mm x 297mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Set the padding
    const padding = 5;

    // Calculate the width and height of the image in the PDF
    let scaledWidth = pdfWidth - 2 * padding;
    let scaledHeight = canvas.height * scaledWidth / canvas.width;
    /**
     * 首先计算图片在PDF中的宽度和高度，
     * 然后根据这个大小计算出需要的页面数。
     * 然后，对于每一页，使用addImage方法将图片的一个部分添加到PDF中。图片的y坐标根据当前的页面数进行调整，以使每一页显示图片的一个不同的部分。
     */
    // Calculate the number of pages
    const pages = Math.ceil(scaledHeight / (pdfHeight - 2 * padding));

    for (let i = 0; i < pages; i++) {
      // The image will start at the padding
      const x = padding;
      const y = -pdfHeight * i + padding;

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

      // Add a new page (except after the last image)
      if (i < pages - 1) {
        pdf.addPage();
      }
    }

    pdf.save('document.pdf');
    document.body.removeChild(element);

  });


  /**
   * 通过设置jsPDF的html方法，存在解析中文字体问题
   */

  // doc.setFont("yahei");
  // doc.html(htmlString, {
  //   callback: function (doc) {
  //     doc.save();
  //   },
  //   x: 10,
  //   y: 10
  // });
  // doc.text('这是标题', 10, 10);
  // doc.save()
  // html2canvas(cloneElement).then((canvas) => {
  //   // Convert the canvas to PDF...
  //   const imgData = canvas.toDataURL('image/png');
  //   console.log('imgData', imgData)
  //   const pdf =  new jsPDF('p', 'px', [canvas.width, canvas.height])
  //   pdf.addImage(imgData, 'PNG', 0,  0, canvas.width,canvas.height);
  //   pdf.save("download.pdf");
  //   // Remove the clone element
  //   document.body.removeChild(cloneElement);
  // });

}
