const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '1CNyD_seHZZyB-2NPusYEpNGF8m5LzUz87RHIYitfnAU';
const SHEET_NAME = 'Pagos';

const appendGasto = async (user, data, fileUrl) => {
  const values = [[
    user.username || user.first_name || user.id,
    new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' }),
    data.tipo,
    data.monto,
    data.comentario,
    data.metodo || '',
    fileUrl
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values
    }
  });
};

module.exports = { appendGasto };
