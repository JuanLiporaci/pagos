# Bot de Gestión de Gastos para Telegram

Bot de Telegram para gestionar y registrar gastos, tanto individuales como múltiples, con integración a Google Drive y Google Sheets.

## Características

- **Gastos individuales**: Permite subir una factura y registrar sus detalles (tipo, fecha, monto, etc.)
- **Gastos múltiples**: Soporta la carga de múltiples facturas para una misma categoría 
- **Categorización**: Organiza los gastos por tipo (Gasolina, Gastos de oficina, etc.)
- **Almacenamiento**: Los archivos se guardan en Google Drive y los datos en Google Sheets
- **Interfaz intuitiva**: Navegación fácil a través de chat de Telegram

## Requisitos

- Node.js >= 18.0.0
- Cuenta de Google con acceso a Drive y Sheets
- Bot de Telegram (creado con @BotFather)

## Variables de Entorno

Crea un archivo `.env` con las siguientes variables:

```env
BOT_TOKEN=tu_token_de_telegram
DRIVE_FOLDER_ID=id_de_la_carpeta_de_drive
SPREADSHEET_ID=id_de_la_hoja_de_calculo
```

## Credenciales de Google

El archivo `credentials.json` debe estar presente en la raíz del proyecto con las credenciales de servicio de Google (con acceso a Drive y Sheets).

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/bot-pagos.git
cd bot-pagos
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno en el archivo `.env`

4. Inicia el bot:
```bash
npm start
```

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

## Despliegue en Railway

1. Crea una cuenta en [Railway](https://railway.app/)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno en Railway
4. El bot se desplegará automáticamente

## Licencia

MIT 
