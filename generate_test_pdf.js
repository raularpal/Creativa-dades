const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const fs = require('fs');

// Mock window and document for the script to run in node environment if needed, 
// but here we will just copy the relevant parts of generatePDF and adapt it for node.
// Actually, since the user wants to see the result of the *actual* code, 
// and I cannot run browser automation, I will create a small HTML file that auto-generates 
// the PDF on load and appends it to the body as an image or download link, 
// then I can try to screenshot that. 
// BUT, since browser tool is failing, I will try to run a node script that uses the *same logic* 
// to generate a PDF file locally.

// However, the original code uses `window.jspdf`. I need to adapt it to use `jspdf` from node if available,
// or just simulate the browser environment. 
// Simpler approach: Create a puppeteer script (if available) or just a simple node script 
// that imports the necessary libraries. 

// Let's try to construct a node script that replicates the generatePDF logic exactly.

// Mock data
const invoiceData = {
    documentType: 'Factura',
    invoiceNumber: '2024-001',
    entryDate: '2024-11-26',
    deliveryDate: '2024-11-30',
    client: 'Client de Prova',
    address: "Carrer de l'Exemple 123",
    city: 'Barcelona',
    postalCode: '08001',
    email: 'client@example.com',
    phone: '600123456',
    dni: '12345678A',
    paymentMethod: 'Transferència',
    paidStatus: 'No',
    products: [
        { name: 'Disseny Web', quantity: 1, price: 500, total: 500 }
    ],
    subtotal: 500,
    iva: 105,
    total: 605,
    applyIva: true
};

const IVA_RATE = 0.21;

// Base64 Logo (truncated for brevity in this comment, but will be full in file)
// I will read it from the file logo_base64.txt
const logoBase64 = fs.readFileSync('logo_base64.txt', 'utf8').trim();

// Generate PDF function adapted for Node
function generateNodePDF(invoiceData, logoBase64) {
    const doc = new jsPDF('landscape');

    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 15, 10, 35, 35);
    }

    // Encabezado izquierdo - La Creativa
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('La Creativa', 55, 18);

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Carrer del Bruc 1, 08600 Berga, Barcelona', 55, 23);
    doc.text('Tel. 693 00 45 22 - 93 194 53 92', 55, 28);
    doc.text('hola@lacreativaberga.cat', 55, 33);

    // Fechas (Alineadas a la derecha, arriba del todo)
    const rightMargin = 280;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    const dateText = `Data d'entrada: ${invoiceData.entryDate}   Data d'entrega: ${invoiceData.deliveryDate}`;
    doc.text(dateText, rightMargin, 15, { align: 'right' });

    // Cliente (Alineado a la derecha, debajo de las fechas)
    doc.setFontSize(10);

    doc.setFont(undefined, 'bold');
    doc.text(`Client:`, rightMargin - 60, 25, { align: 'left' });
    doc.setFont(undefined, 'normal');
    doc.text(invoiceData.client, rightMargin, 25, { align: 'right' });

    doc.setFont(undefined, 'bold');
    doc.text(`Adreça:`, rightMargin - 60, 30, { align: 'left' });
    doc.setFont(undefined, 'normal');
    doc.text(`${invoiceData.address}, ${invoiceData.city} ${invoiceData.postalCode}`, rightMargin, 30, { align: 'right' });

    doc.setFont(undefined, 'bold');
    doc.text(`Email:`, rightMargin - 60, 35, { align: 'left' });
    doc.setFont(undefined, 'normal');
    doc.text(invoiceData.email, rightMargin, 35, { align: 'right' });

    doc.setFont(undefined, 'bold');
    doc.text(`Telèfon:`, rightMargin - 60, 40, { align: 'left' });
    doc.setFont(undefined, 'normal');
    doc.text(invoiceData.phone, rightMargin, 40, { align: 'right' });

    doc.setFont(undefined, 'bold');
    doc.text(`NIF:`, rightMargin - 60, 45, { align: 'left' });
    doc.setFont(undefined, 'normal');
    doc.text(invoiceData.dni, rightMargin, 45, { align: 'right' });

    // Tipo de documento y número (debajo del logo)
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`${invoiceData.documentType}: ${invoiceData.invoiceNumber}`, 50, 50);

    // Tabla de productos
    const startY = 55;

    // Prepare table data
    const tableData = invoiceData.products.map(product => {
        const productIva = invoiceData.applyIva ? product.total * IVA_RATE : 0;
        return [
            product.name,
            product.quantity.toString(),
            product.price.toFixed(2),
            productIva.toFixed(2),
            product.total.toFixed(2)
        ];
    });

    doc.autoTable({
        startY: startY,
        head: [['Producte', 'Quantitat', 'Preu Unitari (€)', 'IVA 21% (€)', 'Subtotal (€)']],
        body: tableData,
        theme: 'plain',
        styles: {
            fontSize: 10,
            cellPadding: 2,
            overflow: 'linebreak',
            halign: 'center',
            valign: 'middle',
            lineWidth: 0.1,
            lineColor: [0, 0, 0]
        },
        headStyles: {
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            0: { cellWidth: 110, halign: 'left' },
            1: { cellWidth: 30 },
            2: { cellWidth: 40 },
            3: { cellWidth: 30 },
            4: { cellWidth: 40 }
        }
    });

    const finalY = doc.lastAutoTable.finalY || startY;

    // Total (Alineado a la derecha de la tabla)
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: ${invoiceData.total.toFixed(2)}€`, 280, finalY + 10, { align: 'right' });

    // Footer Section
    const footerY = finalY + 20;

    // Informació label (Left)
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Informació:', 20, footerY);

    // Payment Info (Right, same line as Informació)
    const paymentText = `Mètode de pagament: ${invoiceData.paymentMethod}     Pagat: ${invoiceData.paidStatus}`;
    doc.text(paymentText, rightMargin, footerY, { align: 'right' });

    // Information Box (Rectangle)
    doc.setDrawColor(0, 0, 0);
    doc.rect(20, footerY + 5, 260, 30);

    return doc;
}

const pdf = generateNodePDF(invoiceData, logoBase64);
pdf.save('test_invoice.pdf');
console.log('PDF generated successfully: test_invoice.pdf');
