# Guía Paso a Paso para Publicar tu App en Internet 🚀

No te preocupes si no tienes experiencia técnica. Sigue estos pasos uno a uno y tendrás tu sistema "Creativa DADES" funcionando en internet en menos de 15 minutos.

Usaremos **Render**, que es una plataforma gratuita y muy fácil de usar.

---

### Paso 1: Crear una cuenta en GitHub
GitHub es donde guardaremos el código de tu aplicación.
1.  Ve a [github.com](https://github.com) y regístrate (es gratis).
2.  Una vez dentro, busca el botón **"New"** (o "Create repository") arriba a la izquierda.
3.  Ponle un nombre, por ejemplo: `creativa-dades`.
4.  Marca la opción **"Private"** (para que nadie más vea tus datos).
5.  Dale al botón verde **"Create repository"**.

### Paso 2: Subir tu código a GitHub
Ahora tenemos que poner los archivos que he creado en ese repositorio.
*Si sabes usar Git en la terminal, haz un `git push` normal. Si no, haz esto:*

1.  En la página de tu nuevo repositorio en GitHub, busca el enlace que dice **"uploading an existing file"**.
2.  Arrastra **TODOS** los archivos de la carpeta `creativa_dades` (app.py, requirements.txt, las carpetas templates, static, etc.) a esa ventana.
3.  Espera a que se carguen y dale al botón verde **"Commit changes"** abajo del todo.

### Paso 3: Crear cuenta en Render
Render es el servidor que ejecutará tu código.
1.  Ve a [render.com](https://render.com).
2.  Dale a **"Get Started for Free"**.
3.  Elige **"Sign up with GitHub"** (así conectamos las dos cuentas automáticamente).

### Paso 4: Conectar y Desplegar
1.  En el panel de Render, haz clic en el botón **"New +"** y elige **"Web Service"**.
2.  Verás una lista de tus repositorios de GitHub. Busca `creativa-dades` y dale a **"Connect"**.
3.  Te pedirá configuración. **No toques casi nada**, Render es listo y detectará mi configuración.
    *   **Name**: Ponle el nombre que quieras para tu web (ej: `mi-creativa-dades`).
    *   **Region**: Elige `Frankfurt` (es la más cercana a España).
    *   **Branch**: Déjalo en `main` o `master`.
    *   **Runtime**: Déjalo en `Python 3`.
    *   **Build Command**: `pip install -r requirements.txt` (debería salir solo).
    *   **Start Command**: `gunicorn app:app` (debería salir solo).
4.  Baja hasta encontrar el plan **"Free"** y selecciónalo.

### Paso 5: Configurar el Email (Opcional pero Recomendado)
Si quieres que los correos funcionen:
1.  En esa misma pantalla, busca la sección **"Environment Variables"**.
2.  Dale a **"Add Environment Variable"**.
3.  Key: `SMTP_USER` / Value: `tu_email@gmail.com`
4.  Dale a "Add" otra vez.
5.  Key: `SMTP_PASSWORD` / Value: `tu_contraseña_de_aplicacion`

### Paso 6: ¡Lanzamiento! 🚀
1.  Dale al botón grande **"Create Web Service"**.
2.  Verás una pantalla negra con letras (logs). Espera unos minutos.
3.  Cuando veas que pone **"Your service is live"**, ¡ya está!
4.  Arriba a la izquierda verás la URL de tu nueva web (algo como `https://mi-creativa-dades.onrender.com`).

¡Esa es tu dirección! Puedes entrar desde el móvil, enviársela a tus empleados o guardarla en favoritos. Tu sistema ya está en la nube.
