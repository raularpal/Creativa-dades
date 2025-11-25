# Creativa DADES - Sistema de Gestión

Este proyecto es una réplica completa del sistema de automatización "Creativa DADES", construido como una aplicación web independiente.

## Requisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

## Instalación Local

1.  Abre una terminal en la carpeta del proyecto.
2.  Instala las dependencias necesarias:
    ```bash
    pip install -r requirements.txt
    ```

## Configuración de Email (Opcional)

Para que el sistema envíe correos reales, configura las variables de entorno:

**En Mac/Linux:**
```bash
export SMTP_USER="tu_email@gmail.com"
export SMTP_PASSWORD="tu_contraseña_de_aplicacion"
```

## Ejecución Local

1.  Inicia el servidor web:
    ```bash
    python app.py
    ```
2.  Abre tu navegador web y ve a: `http://localhost:5000`

## Despliegue en la Nube (Deploy)

Esta aplicación está lista para ser desplegada en plataformas como **Render**, **Heroku** o **Railway**.

### Opción 1: Render (Recomendado - Gratuito)
1.  Sube este código a un repositorio de GitHub.
2.  Crea una cuenta en [Render.com](https://render.com).
3.  Haz clic en "New Web Service".
4.  Conecta tu repositorio de GitHub.
5.  Render detectará automáticamente el archivo `requirements.txt` y usará el comando del `Procfile` (`gunicorn app:app`).
6.  En la sección "Environment Variables", añade `SMTP_USER` y `SMTP_PASSWORD` si quieres que funcionen los emails.
7.  Haz clic en "Create Web Service". ¡Listo!

### Opción 2: Docker
Si prefieres usar contenedores:
```bash
docker build -t creativa-dades .
docker run -p 5000:5000 creativa-dades
```

## Estructura del Proyecto

-   `app.py`: El servidor principal.
-   `automation.py`: Lógica de negocio.
-   `email_sender.py`: Envío de emails.
-   `database.py`: Gestión de datos (JSON).
-   `pdf_generator.py`: Generador de PDF.
-   `Procfile`: Configuración para despliegue en la nube.
-   `Dockerfile`: Configuración para Docker.
