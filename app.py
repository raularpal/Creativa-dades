from flask import Flask, request, jsonify, send_from_directory
import database
import os

app = Flask(__name__, static_folder='.', static_url_path='')

# Initialize DB on startup
database.init_db()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/counters', methods=['GET', 'POST'])
def handle_counters():
    if request.method == 'POST':
        counters = request.json
        database.save_counters(counters)
        return jsonify({"status": "success"})
    else:
        return jsonify(database.get_counters())

@app.route('/api/invoices', methods=['GET', 'POST'])
def handle_invoices():
    if request.method == 'POST':
        invoice = request.json
        database.save_invoice(invoice)
        return jsonify({"status": "success"})
    else:
        return jsonify(database.get_invoices())

@app.route('/api/clients', methods=['GET', 'POST'])
def handle_clients():
    if request.method == 'POST':
        client = request.json
        database.add_client(client)
        return jsonify({"status": "success"})
    else:
        return jsonify(database.get_clients())

if __name__ == '__main__':
    app.run(debug=True, port=5000)
