/**
 * Google Sheets API Integration Helper for Mangalam Ayurveda
 * Provides automated client-side spreadsheet creation, tab configurations,
 * header initializations, and real-time transaction logging.
 */

export interface CompoundingInquiryRow {
  date: string;
  name: string;
  phone: string;
  email: string;
  compounds: string; // Comma-separated list of purchased remedies
  anupana: string;   // Companion intake carrier
  paymentMethod: string;
  totalPrice: number;
  status: string;
}

export interface ConsultationRow {
  date: string;
  timeSlot: string;
  type: string;
  patientName: string;
  patientEmail: string;
  meetingUri: string;
  notes: string;
}

/**
 * Searches the user's Google Drive for a spreadsheet named "Mangalam Ayurveda - Clinical Logs".
 * If it doesn't exist, creates a new spreadsheet with pre-defined sheets/tabs and styled headers.
 */
export async function getOrCreateMasterSpreadsheet(accessToken: string): Promise<string> {
  const query = encodeURIComponent("name = 'Mangalam Ayurveda - Clinical Logs' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false");
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id, name)`;

  try {
    const searchResponse = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (searchResponse.ok) {
      const data = await searchResponse.json();
      if (data.files && data.files.length > 0) {
        return data.files[0].id; // Retain current spreadsheet
      }
    }

    // Spreadsheet not found; create a highly organized Multi-Tab Book
    const createUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: 'Mangalam Ayurveda - Clinical Logs',
        },
        sheets: [
          { properties: { title: 'Compounding Inquiries', gridProperties: { frozenRowCount: 1 } } },
          { properties: { title: 'Consultation Bookings', gridProperties: { frozenRowCount: 1 } } },
          { properties: { title: 'Newsletter Subscribers', gridProperties: { frozenRowCount: 1 } } },
        ],
      }),
    });

    if (!createResponse.ok) {
      const err = await createResponse.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to create spreadsheet structure. Status: ${createResponse.status}`);
    }

    const spreadsheet = await createResponse.json();
    const spreadsheetId = spreadsheet.spreadsheetId;

    // Initialize Headers on each sheets
    await initializeHeaders(accessToken, spreadsheetId);

    return spreadsheetId;
  } catch (error) {
    console.error('Error in getOrCreateMasterSpreadsheet:', error);
    throw error;
  }
}

/**
 * Write column headers to a newly-created clinical log spreadsheet
 */
async function initializeHeaders(accessToken: string, spreadsheetId: string) {
  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`;
  
  const payload = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: "'Compounding Inquiries'!A1:I1",
        values: [
          [
            'Timestamp', 
            'Patient Name', 
            'Contact/Phone', 
            'Email Address', 
            'Compounded Formulae', 
            'Intake Carrier (Anupana)', 
            'Compounding Pathway', 
            'Invoice Amount (₹)', 
            'Preparation Status'
          ]
        ],
      },
      {
        range: "'Consultation Bookings'!A1:G1",
        values: [
          [
            'Schedule Date', 
            'Hour Slot (IST)', 
            'Clinical Discipline', 
            'Practitioner Name', 
            'Authorized Email', 
            'Meet Link', 
            'Diagnostic Notes'
          ]
        ],
      },
      {
        range: "'Newsletter Subscribers'!A1:B1",
        values: [
          [
            'Opt-in Date', 
            'Subscribed Email'
          ]
        ],
      },
    ],
  };

  try {
    const response = await fetch(updateUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn('Could not load cell headers securely into Sheet', response.status);
    }
  } catch (err) {
    console.error('Failed to configure headers:', err);
  }
}

/**
 * Appends a custom compounding inquiry order row into the spreadsheet
 */
export async function logCompoundingInquiry(accessToken: string, row: CompoundingInquiryRow): Promise<void> {
  try {
    const spreadsheetId = await getOrCreateMasterSpreadsheet(accessToken);
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Compounding Inquiries'!A:I:append?valueInputOption=USER_ENTERED`;

    const payload = {
      values: [
        [
          row.date,
          row.name,
          row.phone,
          row.email || 'N/A',
          row.compounds,
          row.anupana,
          row.paymentMethod === 'gpay' ? 'Google Pay (Instant Processing)' : 'Counter Cash (Pay on Pickup)',
          row.totalPrice,
          row.status
        ]
      ]
    };

    const response = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Failed to append Compounding Inquiry to Sheet.');
    }
  } catch (error) {
    console.error('Error logging compounding inquiry:', error);
    throw error;
  }
}

/**
 * Appends a scheduled consultation booking row to the spreadsheet
 */
export async function logConsultationBooking(accessToken: string, row: ConsultationRow): Promise<void> {
  try {
    const spreadsheetId = await getOrCreateMasterSpreadsheet(accessToken);
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Consultation Bookings'!A:G:append?valueInputOption=USER_ENTERED`;

    const payload = {
      values: [
        [
          row.date,
          row.timeSlot,
          row.type,
          row.patientName,
          row.patientEmail,
          row.meetingUri,
          row.notes || 'None'
        ]
      ]
    };

    const response = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Failed to append Booking to Sheet.');
    }
  } catch (error) {
    console.error('Error logging consultation booking:', error);
    throw error;
  }
}

/**
 * Appends a newsletter subscriber's email to the spreadsheet
 */
export async function logNewsletterSubscriber(accessToken: string, email: string): Promise<void> {
  try {
    const spreadsheetId = await getOrCreateMasterSpreadsheet(accessToken);
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Newsletter Subscribers'!A:B:append?valueInputOption=USER_ENTERED`;

    const payload = {
      values: [
        [
          new Date().toLocaleDateString('en-IN'),
          email
        ]
      ]
    };

    const response = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Failed to append Newsletter subscription.');
    }
  } catch (error) {
    console.error('Error logging newsletter subscriber:', error);
    throw error;
  }
}
