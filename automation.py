from datetime import datetime
import database
import pdf_generator
import email_sender
import os

def process_order(form_data):
    # 1. Parse Form Data
    client_data = {
        'name': form_data.get('name'),
        'email': form_data.get('email'),
        'phone': form_data.get('phone'),
        'nif': form_data.get('nif'),
        'address': form_data.get('address'),
        'city': form_data.get('city'),
        'zip': form_data.get('zip')
    }

    items = []
    subtotal = 0.0
    
    # Process up to 6 products
    for i in range(1, 7):
        name = form_data.get(f'prod_name_{i}')
        if name:
            try:
                qty = int(form_data.get(f'prod_qty_{i}', 0))
                price = float(form_data.get(f'prod_price_{i}', 0.0))
                total = qty * price
                subtotal += total
                items.append({
                    'name': name,
                    'quantity': qty,
                    'price': price,
                    'total': total
                })
            except ValueError:
                continue

    iva_rate = 0.21
    iva_total = subtotal * iva_rate
    total_general = subtotal + iva_total

    # 2. Generate Invoice ID (Simple sequential for demo)
    # In a real app, we'd check the last ID in DB
    existing_dades = database.get_dades()
    next_id_num = len(existing_dades) + 1
    invoice_type = 'C' # Default to Comanda
    invoice_id = f"{invoice_type}-{next_id_num:05d}"

    order_data = {
        'invoice_id': invoice_id,
        'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'client_name': client_data['name'],
        'client_nif': client_data['nif'],
        'client_phone': client_data['phone'],
        'client_email': client_data['email'],
        'items': items,
        'subtotal': subtotal,
        'iva_total': iva_total,
        'total_general': total_general
    }

    # Step 2: Add to DADES
    database.add_dade(order_data)

    # Step 3: Generate PDF
    pdf_filename = pdf_generator.generate_invoice(order_data, invoice_id)
    pdf_path = os.path.join(pdf_generator.INVOICES_DIR, pdf_filename)

    # Step 9 (New): Send Email
    email_sender.send_invoice_email(
        to_email=client_data['email'],
        client_name=client_data['name'],
        invoice_filename=pdf_filename,
        invoice_path=pdf_path
    )

    # Step 6 & 7: Check Client
    existing_client = database.get_client_by_phone(client_data['phone'])
    
    if not existing_client:
        # Step 8: New Client
        new_client = client_data.copy()
        new_client['total_orders'] = 1
        new_client['total_spent'] = total_general
        new_client['first_seen'] = order_data['date']
        database.add_client(new_client)
    else:
        # Update stats
        database.update_client_stats(client_data['phone'], total_general)

    # Step 5: Add to COMANDES (Summary)
    summary = {
        'invoice_id': invoice_id,
        'date': order_data['date'],
        'client_name': client_data['name'],
        'total': total_general,
        'pdf_link': f"/invoices/{pdf_filename}",
        'status': 'Pending'
    }
    database.add_comanda(summary)

    return invoice_id, pdf_filename
