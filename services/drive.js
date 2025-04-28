// services/drive.js
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

let drive;

const setupDriveService = () => {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive.file']
        });

        drive = google.drive({ version: 'v3', auth });
        console.log('Drive service initialized successfully');
    } catch (error) {
        console.error('Error initializing Drive service:', error);
        throw error;
    }
};

const uploadFile = async (filePath, fileName) => {
    try {
        const fileMetadata = {
            name: fileName,
            parents: [process.env.DRIVE_FOLDER_ID]
        };

        const media = {
            mimeType: 'application/octet-stream',
            body: fs.createReadStream(filePath)
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        });

        return response.data.id;
    } catch (error) {
        console.error('Error uploading file to Drive:', error);
        throw error;
    }
};

const saveFile = async (ctx) => {
  const fileId = ctx.session.fileId;
  const file = await ctx.telegram.getFile(fileId);
  const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

  const ext = path.extname(file.file_path) || '.jpg';
  const fileName = `gasto_${ctx.from.username || ctx.from.id}_${Date.now()}${ext}`;
  const filePath = path.join(__dirname, fileName);

  const response = await axios({ url, responseType: 'stream' });
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  const folderId = process.env.DRIVE_FOLDER_ID || null;
  const fileMetadata = {
    name: fileName,
    parents: folderId ? [folderId] : []
  };
  const media = {
    mimeType: response.headers['content-type'],
    body: fs.createReadStream(filePath)
  };

  const uploadedFile = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id'
  });

  // Hacer público el archivo
  await drive.permissions.create({
    fileId: uploadedFile.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  });

  const link = `https://drive.google.com/file/d/${uploadedFile.data.id}/view?usp=sharing`;

  fs.unlinkSync(filePath); // Borrar archivo temporal
  return link;
};

module.exports = {
    setupDriveService,
    uploadFile,
    saveFile
};
