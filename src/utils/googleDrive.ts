/**
 * Google Drive API Integration Helper for Mangalam Ayurveda
 * Provides robust client-side interactions with the Drive v3 endpoints.
 */

// Scope required
export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';

export interface DriveFile {
  id: string;
  name: string;
  webViewLink: string;
  createdTime: string;
  size?: string;
}

/**
 * Ensures the 'Mangalam Ayurveda' parent folder exists in the user's Google Drive.
 * If it doesn't, creates it and returns its ID.
 */
export async function getOrCreateAppFolder(accessToken: string): Promise<string> {
  const query = encodeURIComponent("name = 'Mangalam Ayurveda' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id, name)`;

  try {
    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Failed to search for folder on Google Drive.');
    }

    const data = await response.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }

    // Folder does not exist, create it
    const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Mangalam Ayurveda',
        mimeType: 'application/vnd.google-apps.folder',
        description: 'Traditional Ayurvedic Health Reports & Prescription Materials',
      }),
    });

    if (!createResponse.ok) {
      const err = await createResponse.json();
      throw new Error(err.error?.message || 'Failed to create root Mangalam folder in Drive.');
    }

    const createdFolder = await createResponse.json();
    return createdFolder.id;
  } catch (error) {
    console.error('Error in getOrCreateAppFolder:', error);
    throw error;
  }
}

/**
 * Uploads a client-generated Ayurvedic report PDF directly to the 'Mangalam Ayurveda' Google Drive folder.
 */
export async function uploadReportToDrive(
  accessToken: string,
  pdfBlob: Blob,
  filename: string
): Promise<DriveFile> {
  try {
    // 1. Get or create target directory folder
    const folderId = await getOrCreateAppFolder(accessToken);

    // 2. Prepare multipart body metadata and content payload
    const metadata = {
      name: filename,
      mimeType: 'application/pdf',
      parents: [folderId],
      description: 'Mangalam Traditional Ayurveda Clinical Constitution Report'
    };

    const boundary = 'MANGALAM_DRIVE_MULTIPART_BOUNDARY_MARK';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadataPart = JSON.stringify(metadata);
    
    // We construct a binary payload using Blob parts to safely handle raw binary pdf Blob in client-side fetch
    const payloadParts: (string | Blob)[] = [];
    payloadParts.push(delimiter);
    payloadParts.push('Content-Type: application/json; charset=UTF-8\r\n\r\n');
    payloadParts.push(metadataPart);
    payloadParts.push(delimiter);
    payloadParts.push('Content-Type: application/pdf\r\n\r\n');
    payloadParts.push(pdfBlob);
    payloadParts.push(closeDelimiter);

    const multipartBlob = new Blob(payloadParts, {
      type: `multipart/related; boundary=${boundary}`,
    });

    // 3. Dispatch multipart POST request
    const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,createdTime,size';
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: multipartBlob,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Failed to upload report PDF to Google Drive.');
    }

    const uploadedFile: DriveFile = await response.json();
    return uploadedFile;
  } catch (error) {
    console.error('Error in uploadReportToDrive:', error);
    throw error;
  }
}

/**
 * Retrieves all digital reports previously committed to the 'Mangalam Ayurveda' directory.
 */
export async function listReportsOnDrive(accessToken: string): Promise<DriveFile[]> {
  try {
    const folderId = await getOrCreateAppFolder(accessToken);
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false and mimeType = 'application/pdf'`);
    const listUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink,createdTime,size)&orderBy=createdTime desc`;

    const response = await fetch(listUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Failed to sync archived reports list from Google Drive.');
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error listing reports from Google Drive:', error);
    throw error;
  }
}

/**
 * Securely deletes a specific report on Google Drive by fileId, requiring user confirmation first.
 */
export async function deleteReportFromDrive(accessToken: string, fileId: string): Promise<boolean> {
  const deleteUrl = `https://www.googleapis.com/drive/v3/files/${fileId}`;

  try {
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // If of type JSON
      try {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to delete file.');
      } catch (e) {
        throw new Error(`Deletion response code: ${response.status}`);
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting report from Google Drive:', error);
    throw error;
  }
}
