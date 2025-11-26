import json
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
DADES_FILE = os.path.join(DATA_DIR, 'dades.json')
CLIENTS_FILE = os.path.join(DATA_DIR, 'clients.json')
COMANDES_FILE = os.path.join(DATA_DIR, 'comandes.json')

def _load_json(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def _save_json(filepath, data):
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=4)

def init_db():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    for f in [DADES_FILE, CLIENTS_FILE, COMANDES_FILE]:
        if not os.path.exists(f):
            _save_json(f, [])

def add_dade(entry):
    data = _load_json(DADES_FILE)
    data.append(entry)
    _save_json(DADES_FILE, data)

def get_dades():
    return _load_json(DADES_FILE)

def get_clients():
    return _load_json(CLIENTS_FILE)

def get_client_by_phone(phone):
    clients = _load_json(CLIENTS_FILE)
    # Normalize phone for comparison could be added here
    for client in clients:
        if client.get('phone') == phone:
            return client
    return None

def add_client(client_data):
    clients = _load_json(CLIENTS_FILE)
    clients.append(client_data)
    _save_json(CLIENTS_FILE, clients)

def update_client_stats(phone, amount):
    clients = _load_json(CLIENTS_FILE)
    for client in clients:
        if client.get('phone') == phone:
            client['total_orders'] = client.get('total_orders', 0) + 1
            client['total_spent'] = client.get('total_spent', 0.0) + amount
            _save_json(CLIENTS_FILE, clients)
            return
    # If client not found (shouldn't happen if flow is correct), we could add them or ignore.

def add_comanda(summary):
    data = _load_json(COMANDES_FILE)
    data.append(summary)
    _save_json(COMANDES_FILE, data)

def get_comandes():
    return _load_json(COMANDES_FILE)

COUNTERS_FILE = os.path.join(DATA_DIR, 'counters.json')

def get_counters():
    if not os.path.exists(COUNTERS_FILE):
        return {"Comanda": 0, "Pressupost": 0}
    return _load_json(COUNTERS_FILE)

def save_counters(counters):
    _save_json(COUNTERS_FILE, counters)

def save_invoice(invoice):
    # Using comandes file for invoices
    data = _load_json(COMANDES_FILE)
    data.append(invoice)
    _save_json(COMANDES_FILE, data)

def get_invoices():
    return _load_json(COMANDES_FILE)
