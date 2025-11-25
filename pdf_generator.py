from fpdf import FPDF
import os

INVOICES_DIR = 'invoices'

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'La Creativa - Albarà', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_invoice(data, invoice_id):
    if not os.path.exists(INVOICES_DIR):
        os.makedirs(INVOICES_DIR)

    pdf = PDF()
    pdf.add_page()
    
    # Client Info
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, f'Albarà: {invoice_id}', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.cell(0, 6, f"Client: {data['client_name']}", 0, 1)
    pdf.cell(0, 6, f"NIF: {data['client_nif']}", 0, 1)
    pdf.cell(0, 6, f"Tel: {data['client_phone']}", 0, 1)
    pdf.cell(0, 6, f"Email: {data['client_email']}", 0, 1)
    pdf.ln(10)

    # Table Header
    pdf.set_font('Arial', 'B', 10)
    pdf.cell(80, 10, 'Producte', 1)
    pdf.cell(30, 10, 'Quantitat', 1)
    pdf.cell(30, 10, 'Preu Unit.', 1)
    pdf.cell(30, 10, 'Total', 1)
    pdf.ln()

    # Table Content
    pdf.set_font('Arial', '', 10)
    for item in data['items']:
        if item['name']: # Only process if name exists
            pdf.cell(80, 10, item['name'], 1)
            pdf.cell(30, 10, str(item['quantity']), 1)
            pdf.cell(30, 10, f"{item['price']:.2f}€", 1)
            pdf.cell(30, 10, f"{item['total']:.2f}€", 1)
            pdf.ln()

    pdf.ln(5)
    
    # Totals
    pdf.set_font('Arial', 'B', 10)
    pdf.cell(140, 10, 'Subtotal', 1)
    pdf.cell(30, 10, f"{data['subtotal']:.2f}€", 1)
    pdf.ln()
    pdf.cell(140, 10, 'IVA (21%)', 1)
    pdf.cell(30, 10, f"{data['iva_total']:.2f}€", 1)
    pdf.ln()
    pdf.cell(140, 10, 'TOTAL', 1)
    pdf.cell(30, 10, f"{data['total_general']:.2f}€", 1)
    pdf.ln()

    filename = f"invoice_{invoice_id}.pdf"
    filepath = os.path.join(INVOICES_DIR, filename)
    pdf.output(filepath)
    return filename
