const { Telegraf } = require('telegraf');
const gastoFlow = require('./handlers/gastosFlow');
const session = require('./utils/userSession');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session.middleware);

bot.start((ctx) => {
  ctx.session = { estado: 'esperandoArchivo' };
  ctx.reply('¡Hola! Envíame una foto o PDF de tu factura para comenzar 🧾');
});

bot.on(['photo', 'document'], gastoFlow.handleArchivo);

bot.on('text', (ctx) => {
  // Inicializar la sesión si no existe
  if (!ctx.session) {
    ctx.session = { estado: 'esperandoArchivo' };
  }

  // Reinicio manual
  if (ctx.message.text.trim() === '0' || ctx.message.text.trim() === '000') {
    ctx.session = { estado: 'esperandoArchivo' };
    return ctx.reply('Proceso reiniciado. Envíame una foto o PDF de tu factura para comenzar 🧾');
  }

  const estado = ctx.session.estado;

  // Flujo ordenado correctamente
  if (estado === 'tipo') return gastoFlow.handleTipo(ctx);
  if (estado === 'monto') return gastoFlow.handleMonto(ctx);
  if (estado === 'comentario' || estado === 'comentarioLibre') return gastoFlow.handleComentario(ctx);
  if (estado === 'metodo') return gastoFlow.handleMetodo(ctx);
  if (estado === 'esperandoOtro') return gastoFlow.handleConfirmacion(ctx);

  // Si no hay ningún estado válido
  if (estado === 'esperandoArchivo') {
    return ctx.reply('Por favor, envía una foto o PDF de la factura para comenzar 🧾');
  }

  ctx.reply('Por favor, envía una foto o PDF de la factura para comenzar 🧾');
});

bot.launch();

console.log('Bot de gastos corriendo...');
