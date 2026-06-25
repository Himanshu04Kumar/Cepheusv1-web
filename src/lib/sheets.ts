import { google } from 'googleapis';

export async function logToSheets(bookingData: any) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    const values = [
      [
        new Date().toISOString(),
        bookingData.id,
        bookingData.customer_name,
        bookingData.customer_phone,
        bookingData.device_brand,
        bookingData.device_model,
        bookingData.issue_description,
        bookingData.status,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
  } catch (error) {
    console.error('Failed to log to Google Sheets:', error);
  }
}
