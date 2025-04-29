# Bot de Gestión de Gastos

Bot de Telegram para gestionar gastos por categoría y departamento, con integración a Google Drive y Google Sheets.

## Características

- Registro de gastos por categoría
- Registro de gastos por departamento
- Almacenamiento de comprobantes en Google Drive
- Registro de datos en Google Sheets
- Interfaz intuitiva por chat

## Requisitos

- Node.js >= 18.0.0
- Cuenta de Google con acceso a Drive y Sheets
- Bot de Telegram (creado con @BotFather)

## Variables de Entorno

Crea un archivo `.env` con las siguientes variables:

```env
BOT_TOKEN=tu_token_de_telegram
GOOGLE_CREDENTIALS=tu_json_de_credenciales_de_google
DRIVE_FOLDER_ID=id_de_la_carpeta_de_drive
SHEET_ID=id_de_la_hoja_de_calculo
```

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

## Uso

1. Inicia el bot con el comando `/start`
2. Selecciona si deseas registrar un gasto por categoría o departamento
3. Sigue las instrucciones del bot para completar el registro

## Despliegue en Railway

1. Crea una cuenta en [Railway](https://railway.app/)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno en Railway
4. El bot se desplegará automáticamente

## Licencia

MIT 