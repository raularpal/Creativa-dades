# Creativa DADES - Sistema de Facturació

## 🚀 Característiques

- ✅ Generació de factures en PDF amb disseny professional
- ✅ Enviament automàtic per correu al client
- ✅ Emmagatzematge local de totes les factures
- ✅ Tauler amb estadístiques i llistat de factures
- ✅ Disseny premium amb mode fosc i glassmorphism
- ✅ 100% funcional sense necessitat de backend

## 📋 Com utilitzar

### 1. Obrir l'aplicació

Simplement obre `index.html` al teu navegador. No necessites servidor web.

### 2. Configurar EmailJS (opcional però recomanat)

Perquè l'enviament automàtic de correus funcioni:

1. Ves a [EmailJS](https://www.emailjs.com/) i crea un compte gratuït
2. Crea un servei de correu (Gmail, Outlook, etc.)
3. Crea una plantilla de correu amb aquests paràmetres:
   - `{{to_email}}` - Correu del destinatari
   - `{{client_name}}` - Nom del client
   - `{{invoice_number}}` - Número de factura
   - `{{amount}}` - Import
   - `{{description}}` - Descripció
4. Copia les teves credencials i enganxa-les a `script.js`:
   ```javascript
   const EMAILJS_PUBLIC_KEY = 'la_teva_public_key';
   const EMAILJS_SERVICE_ID = 'el_teu_service_id';
   const EMAILJS_TEMPLATE_ID = 'el_teu_template_id';
   ```

### 3. Generar factures

1. Omple el formulari amb les dades del client
2. Fes clic a "Generar i Enviar Factura"
3. El PDF es descarregarà automàticament
4. Si EmailJS està configurat, s'enviarà per correu
5. La factura es desarà al tauler

### 4. Veure tauler

Fes clic al botó "Tauler" per veure:
- Total de factures generades
- Import total facturat
- Mitjana per factura
- Llistat complet de totes les factures

## 🎨 Característiques del disseny

- **Dark mode premium** amb gradients
- **Glassmorphism** en tots els components
- **Animacions suaus** en interaccions
- **Responsive** per a mòbils i tauletes
- **Tipografia moderna** (Inter de Google Fonts)

## 📦 Tecnologies

- HTML5
- CSS3 (Vanilla CSS amb variables)
- JavaScript (ES6+)
- jsPDF (generació de PDFs)
- EmailJS (enviament de correus)
- localStorage (persistència de dades)

## 🔧 Personalització

Pots personalitzar els colors editant les variables CSS a `style.css`:

```css
:root {
  --bg-color: #0a0a0a;
  --primary-color: #1e90ff;
  --secondary-color: #63b3ed;
  /* ... més variables */
}
```

## 📱 Pròxims passos

- [ ] Integració amb Google Sheets per a backup al núvol
- [ ] Exportar tauler a Excel
- [ ] Plantilles de factura personalitzables
- [ ] Gestió de clients
- [ ] Desplegament a Vercel/Netlify

## 💡 Notes

- Les dades es desen al localStorage del navegador
- Si esborres les dades del navegador, perdràs les factures desades
- Per a producció, considera utilitzar una base de dades real
