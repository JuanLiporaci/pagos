const { processFile, saveToDrive, saveToSheet } = require('../utils');

const gastosPorDepartamentoFlow = {
    async handleMessage(ctx) {
        const estado = ctx.session.estado;
        
        switch (estado) {
            case 'seleccionandoDepartamento':
                return this.handleSeleccionDepartamento(ctx);
            case 'esperandoMonto':
                return this.handleMonto(ctx);
            case 'esperandoFecha':
                return this.handleFecha(ctx);
            case 'esperandoArchivos':
                return this.handleArchivos(ctx);
            default:
                return ctx.reply('Por favor, usa el comando /start para comenzar.');
        }
    },

    async handleSeleccionDepartamento(ctx) {
        const departamento = ctx.message.text.trim();
        ctx.session.departamento = departamento;
        ctx.session.estado = 'esperandoMonto';
        return ctx.reply(`Por favor, ingresa el monto total del gasto para ${departamento}:`);
    },

    async handleMonto(ctx) {
        const monto = parseFloat(ctx.message.text.trim());
        if (isNaN(monto) || monto <= 0) {
            return ctx.reply('Por favor, ingresa un monto válido mayor a 0.');
        }
        ctx.session.monto = monto;
        ctx.session.estado = 'esperandoFecha';
        return ctx.reply('Por favor, ingresa la fecha del gasto en formato MM/DD (por ejemplo: 12/25):');
    },

    async handleFecha(ctx) {
        const fecha = ctx.message.text.trim();
        const fechaRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/;
        
        if (!fechaRegex.test(fecha)) {
            return ctx.reply('Formato de fecha inválido. Por favor, usa el formato MM/DD (por ejemplo: 12/25).');
        }
        
        ctx.session.fecha = fecha;
        ctx.session.estado = 'esperandoArchivos';
        return ctx.reply('Por favor, envía los archivos de comprobante (fotos o documentos):');
    },

    async handleArchivos(ctx) {
        try {
            const file = ctx.message.photo ? ctx.message.photo[ctx.message.photo.length - 1] : ctx.message.document;
            if (!file) {
                return ctx.reply('Por favor, envía un archivo válido.');
            }

            const fileId = file.file_id;
            const fileInfo = await ctx.telegram.getFile(fileId);
            const filePath = fileInfo.file_path;
            
            const processedFile = await processFile(filePath);
            const driveUrl = await saveToDrive(processedFile, ctx.session.departamento);
            
            await saveToSheet({
                tipo: 'departamento',
                departamento: ctx.session.departamento,
                monto: ctx.session.monto,
                fecha: ctx.session.fecha,
                archivo: driveUrl
            });

            ctx.session = { estado: 'inicio' };
            return ctx.reply('✅ Gasto registrado exitosamente. Puedes usar /start para registrar otro gasto.');
        } catch (error) {
            console.error('Error al procesar archivo:', error);
            return ctx.reply('❌ Hubo un error al procesar el archivo. Por favor, intenta nuevamente.');
        }
    }
};

module.exports = gastosPorDepartamentoFlow; 