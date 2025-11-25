from flask import Flask, render_template, request, send_from_directory, redirect, url_for
import automation
import database
import os

app = Flask(__name__)

# Initialize DB on startup
database.init_db()

@app.route('/')
def index():
    return redirect(url_for('form'))

@app.route('/form', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        invoice_id, pdf_filename = automation.process_order(request.form)
        return render_template('success.html', invoice_id=invoice_id, pdf_filename=pdf_filename)
    return render_template('form.html')

@app.route('/dashboard')
def dashboard():
    dades = database.get_dades()
    clients = database.get_clients()
    comandes = database.get_comandes()
    return render_template('dashboard.html', dades=dades, clients=clients, comandes=comandes)

@app.route('/invoices/<filename>')
def get_invoice(filename):
    return send_from_directory('invoices', filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
