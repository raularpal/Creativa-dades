/**
 * GOOGLE APPS SCRIPT CODE
 * 
 * 1. Create a new Google Sheet.
 * 2. Go to Extensions -> Apps Script.
 * 3. Paste this code.
 * 4. Create two sheets named "invoices" and "clients".
 * 5. Add headers to "invoices" in row 1:
 *    invoice_id, document_type, date, entry_date, delivery_date, client_name, client_nif, client_phone, client_email, client_address, client_city, client_zip, items, subtotal, iva_applied, iva_total, total_general, payment_method, paid_status, pdf_url, observations, discount
 * 6. Add headers to "clients" in row 1:
 *    name, nif, phone, email, address, city, postal_code, total_orders, total_spent
 * 7. Click "Deploy" -> "New Deployment".
 * 8. Select "Web App".
 * 9. Set "Execute as" to "Me" and "Who has access" to "Anyone".
 * 10. Copy the Web App URL and paste it into script.js.
 */

function doGet(e) {
    const action = e.parameter.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'getInvoices') {
        return getSheetData(ss.getSheetByName('invoices'));
    }

    if (action === 'getClients') {
        return getSheetData(ss.getSheetByName('clients'));
    }

    if (action === 'test') {
        return ContentService.createTextOutput("Connection OK").setMimeType(ContentService.MimeType.TEXT);
    }
}

function doPost(e) {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'saveInvoice') {
        return saveInvoice(ss, body.data);
    }

    if (action === 'updateInvoice') {
        return updateInvoice(ss, body.invoiceId, body.data);
    }

    if (action === 'saveClient') {
        return saveClient(ss, body.data);
    }

    if (action === 'deleteInvoice') {
        return deleteInvoice(ss, body.invoiceId);
    }

    if (action === 'deleteClient') {
        return deleteClient(ss, body.nif);
    }

    if (action === 'uploadPDF') {
        return uploadPDF(body.base64, body.filename);
    }
}

function getSheetData(sheet) {
    if (!sheet) return errorResponse("Sheet not found");
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    const result = data.map(row => {
        let obj = {};
        headers.forEach((h, i) => {
            // Parse JSON fields if they look like arrays/objects
            let val = row[i];
            if (h === 'items' && typeof val === 'string') {
                try { val = JSON.parse(val); } catch (e) { }
            }
            obj[h] = val;
        });
        return obj;
    });
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function saveInvoice(ss, rowData) {
    const sheet = ss.getSheetByName('invoices');
    const headers = sheet.getDataRange().getValues()[0];
    const newRow = headers.map(h => {
        let val = rowData[h];
        if (typeof val === 'object') val = JSON.stringify(val);
        return val || "";
    });
    sheet.appendRow(newRow);
    return successResponse();
}

function updateInvoice(ss, invoiceId, rowData) {
    const sheet = ss.getSheetByName('invoices');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIdx = headers.indexOf('invoice_id');

    for (let i = 1; i < data.length; i++) {
        if (data[i][idIdx] === invoiceId) {
            const newRowData = headers.map((h, j) => {
                let val = rowData[h] !== undefined ? rowData[h] : data[i][j];
                if (typeof val === 'object') val = JSON.stringify(val);
                return val;
            });
            sheet.getRange(i + 1, 1, 1, headers.length).setValues([newRowData]);
            return successResponse();
        }
    }
    return errorResponse("Invoice not found");
}

function saveClient(ss, rowData) {
    const sheet = ss.getSheetByName('clients');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const nifIdx = headers.indexOf('nif');

    let found = false;
    for (let i = 1; i < data.length; i++) {
        if (data[i][nifIdx] === rowData.nif) {
            const newRowData = headers.map((h, j) => {
                let val = rowData[h] !== undefined ? rowData[h] : data[i][j];
                return val;
            });
            sheet.getRange(i + 1, 1, 1, headers.length).setValues([newRowData]);
            found = true;
            break;
        }
    }

    if (!found) {
        const newRow = headers.map(h => rowData[h] || "");
        sheet.appendRow(newRow);
    }
    return successResponse();
}

function uploadPDF(base64, filename) {
    try {
        const folderName = "Creativa_Invoices_PDFs";
        let folder;
        const folders = DriveApp.getFoldersByName(folderName);
        if (folders.hasNext()) {
            folder = folders.next();
        } else {
            folder = DriveApp.createFolder(folderName);
        }

        const contentType = "application/pdf";
        const decoded = Utilities.base64Decode(base64.split(",")[1]);
        const blob = Utilities.newBlob(decoded, contentType, filename);
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            url: file.getUrl()
        })).setMimeType(ContentService.MimeType.JSON);
    } catch (e) {
        return errorResponse(e.toString());
    }
}

function deleteInvoice(ss, invoiceId) {
    const sheet = ss.getSheetByName('invoices');
    const data = sheet.getDataRange().getValues();
    const idIdx = data[0].indexOf('invoice_id');

    for (let i = 1; i < data.length; i++) {
        if (data[i][idIdx] === invoiceId) {
            sheet.deleteRow(i + 1);
            return successResponse();
        }
    }
    return errorResponse("Invoice not found");
}

function deleteClient(ss, nif) {
    const sheet = ss.getSheetByName('clients');
    const data = sheet.getDataRange().getValues();
    const nifIdx = data[0].indexOf('nif');

    for (let i = 1; i < data.length; i++) {
        if (data[i][nifIdx] === nif) {
            sheet.deleteRow(i + 1);
            return successResponse();
        }
    }
    return errorResponse("Client not found");
}

function successResponse() {
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
}

function errorResponse(msg) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: msg })).setMimeType(ContentService.MimeType.JSON);
}
