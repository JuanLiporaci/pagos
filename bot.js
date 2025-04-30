const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const gastosPorCategoriaFlow = require('./handlers/gastosPorCategoriaFlow');
const gastosPorDepartamentoFlow = require('./handlers/gastosPorDepartamentoFlow');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Inicializar sesión
bot.use((ctx, next) => {
    if (!ctx.session) {
        ctx.session = { estado: 'inicio' };
    }
    return next();
});

// Comando de inicio
bot.command('start', (ctx) => {
    ctx.session = { estado: 'inicio' };
    return ctx.reply(
        '¡Bienvenido al bot de gestión de gastos! Por favor, selecciona una opción:\n\n' +
        '1️⃣ Gastos por categoría\n' +
        '2️⃣ Gastos por departamento\n\n' +
        'Escribe el número de la opción que deseas utilizar.'
    );
});

// Manejo de mensajes
bot.on(message('text'), async (ctx) => {
    const estado = ctx.session.estado;

    if (estado === 'inicio') {
        const opcion = ctx.message.text.trim();
        if (opcion === '1') {
            ctx.session.estado = 'seleccionandoCategoria';
            return ctx.reply(
                'Por favor, selecciona una categoría de gasto:\n\n' +
                '• Gas\n' +
                '• Luz\n' +
                '• Agua\n' +
                '• Internet\n' +
                '• Teléfono\n' +
                '• Alquiler\n' +
                '• Mantenimiento\n' +
                '• Seguros\n' +
                '• Impuestos\n' +
                '• Otros'
            );
        } else if (opcion === '2') {
            ctx.session.estado = 'seleccionandoDepartamento';
            return ctx.reply('Por favor, ingresa el nombre del departamento:');
        } else {
            return ctx.reply('Opción inválida. Por favor, selecciona 1 o 2.');
        }
    }

    // Redirigir al flujo correspondiente
    if (['seleccionandoCategoria', 'esperandoMonto', 'esperandoFecha', 'esperandoArchivos'].includes(estado)) {
        return gastosPorCategoriaFlow.handleMessage(ctx);
    } else if (['seleccionandoDepartamento', 'esperandoMonto', 'esperandoFecha', 'esperandoArchivos'].includes(estado)) {
        return gastosPorDepartamentoFlow.handleMessage(ctx);
    }
});

// Manejo de archivos
bot.on([message('photo'), message('document')], async (ctx) => {
    const estado = ctx.session.estado;
    
    if (estado === 'esperandoArchivos') {
        if (['seleccionandoCategoria', 'esperandoMonto', 'esperandoFecha', 'esperandoArchivos'].includes(estado)) {
            return gastosPorCategoriaFlow.handleMessage(ctx);
        } else if (['seleccionandoDepartamento', 'esperandoMonto', 'esperandoFecha', 'esperandoArchivos'].includes(estado)) {
            return gastosPorDepartamentoFlow.handleMessage(ctx);
        }
    }
});

// Iniciar el bot
bot.launch();

// Manejo de señales de terminación
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 