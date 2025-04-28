const { google } = require('googleapis');

let sheets;

const setupSheetsService = () => {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        sheets = google.sheets({ version: 'v4', auth });
        console.log('Sheets service initialized successfully');
    } catch (error) {
        console.error('Error initializing Sheets service:', error);
        throw error;
    }
};

const appendRow = async (values) => {
    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SHEET_ID,
            range: `${process.env.SHEET_NAME}!A:Z`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [values]
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error appending row to sheet:', error);
        throw error;
    }
};

module.exports = {
    setupSheetsService,
    appendRow
};
