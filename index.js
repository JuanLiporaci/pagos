require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const { middleware: sessionMiddleware } = require('./utils/userSession');
const { setupDriveService } = require('./services/drive');
const { setupSheetsService } = require('./services/sheets');

// Inicializar el bot con el token desde variables de entorno
const bot = new Telegraf(process.env.BOT_TOKEN);

// Configurar middleware de sesión
bot.use(session());
bot.use(sessionMiddleware);

// Configurar servicios
setupDriveService();
setupSheetsService();

// Manejar fotos y documentos
bot.on(['photo', 'document'], async (ctx) => {
    try {
        let fileId;
        let fileName;

        if (ctx.message.photo) {
            // Obtener la foto de mayor resolución
            const photo = ctx.message.photo[ctx.message.photo.length - 1];
            fileId = photo.file_id;
            fileName = `factura_${Date.now()}.jpg`;
        } else if (ctx.message.document) {
            fileId = ctx.message.document.file_id;
            fileName = ctx.message.document.file_name;
        }

        // Obtener información del archivo
        const file = await ctx.telegram.getFile(fileId);
        const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

        // Aquí puedes procesar el archivo según sea necesario
        // Por ejemplo, guardarlo en Google Drive o procesarlo con OCR

        ctx.reply(`Archivo recibido: ${fileName}\nURL: ${fileUrl}`);
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
        ctx.reply('Hubo un error al procesar el archivo. Por favor, inténtalo de nuevo.');
    }
});

// Manejar mensajes de texto
bot.on('text', (ctx) => {
    // Inicializar la sesión si no existe
    if (!ctx.session) {
        ctx.session = { estado: 'esperandoArchivo' };
    }

    // Reinicio manual
    if (ctx.message.text.trim() === '0') {
        ctx.session = { estado: 'esperandoArchivo' };
        return ctx.reply('Proceso reiniciado. Envíame una foto o PDF de tu factura para comenzar 🧾');
    }

    // Si el estado es esperandoArchivo, pedir una foto o PDF
    if (ctx.session.estado === 'esperandoArchivo') {
        ctx.reply('Por favor, envía una foto o PDF de la factura para comenzar 🧾');
    }
});

// Iniciar el bot
const PORT = process.env.PORT || 3000;
bot.launch({
    webhook: {
        domain: process.env.RAILWAY_STATIC_URL,
        port: PORT
    }
}).then(() => {
    console.log('Bot is running on port', PORT);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
