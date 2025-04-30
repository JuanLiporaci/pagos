# Bot de Gestión de Gastos para Telegram

Bot de Telegram para gestionar y registrar gastos, tanto individuales como múltiples.

## Características

- **Gastos individuales**: Permite subir una factura y registrar sus detalles (tipo, fecha, monto, etc.)
- **Gastos múltiples**: Soporta la carga de múltiples facturas para una misma categoría 
- **Categorización**: Organiza los gastos por tipo (Gasolina, Gastos de oficina, etc.)
- **Almacenamiento**: Los archivos se guardan en Google Drive y los datos en Google Sheets

## Configuración en Railway

### Variables de entorno necesarias

- `BOT_TOKEN`: Token de acceso del bot de Telegram
- `DRIVE_FOLDER_ID`: ID de la carpeta de Google Drive para almacenar archivos
- `SPREADSHEET_ID`: ID de la hoja de Google Sheets para almacenar datos

### Credenciales de Google

El archivo `credentials.json` debe estar presente en la raíz del proyecto con las credenciales de servicio de Google (con acceso a Drive y Sheets).

## Comandos disponibles

```
npm start         # Iniciar el bot
npm run dev       # Iniciar el bot en modo desarrollo
```

## Estructura del proyecto

- `index.js`: Punto de entrada principal
- `handlers/`: Manejadores de flujos de conversación
- `services/`: Servicios de integración (Google Drive, Sheets)
- `utils/`: Utilidades generales

## Flujos de conversación

### Gasto Individual
1. Enviar archivo (foto/PDF)
2. Seleccionar tipo de gasto
3. Indicar fecha de gasto
4. Especificar monto
5. Añadir comentario (opcional)
6. Indicar método de pago

### Gastos Múltiples
1. Seleccionar categoría
2. Indicar monto total
3. Especificar rango de fechas
4. Añadir comentario (opcional)
5. Enviar todos los archivos
6. Confirmar para finalizar 