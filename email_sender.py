import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import os

# Configuration (In a real app, use Environment Variables)
SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER', 'tu_email@gmail.com')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', 'tu_contraseña_de_aplicacion')

def send_invoice_email(to_email, client_name, invoice_filename, invoice_path):
    msg = MIMEMultipart()
    msg['Subject'] = f'Tu Factura de La Creativa - {invoice_filename}'
    msg['From'] = SMTP_USER
    msg['To'] = to_email

    body = f"""
    Hola {client_name},

    Muchas gracias por tu pedido en La Creativa.
    
    Adjunto encontrarás tu albarán/factura ({invoice_filename}).

    Si tienes alguna duda, estamos a tu disposición.

    Saludos,
    El equipo de La Creativa
    """
    msg.attach(MIMEText(body, 'plain'))

    # Attach PDF
    try:
        with open(invoice_path, "rb") as f:
            part = MIMEApplication(f.read(), Name=invoice_filename)
        part['Content-Disposition'] = f'attachment; filename="{invoice_filename}"'
        msg.attach(part)
    except FileNotFoundError:
        print(f"Error: Could not find invoice file at {invoice_path}")
        return False

    # Send Email
    try:
        # Only attempt to send if we have a valid user configured (basic check)
        if 'tu_email' in SMTP_USER:
            print("Mock Email Sent: SMTP credentials not configured.")
            return True

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
