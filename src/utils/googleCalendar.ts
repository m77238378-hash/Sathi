/**
 * Google Calendar API Integration Helper for Mangalam Ayurveda
 * Provides robust client-side interaction with the Calendar v3 API
 * to schedule consultations and attach synchronized Google Meet conference rooms.
 */

export interface CalendarEventResponse {
  id: string;
  htmlLink: string;
  meetingUri: string;
  meetingCode: string;
  start: string;
  end: string;
}

/**
 * Utility to parse formatted slot time back to legitimate local ISO time strings
 * Examples: 
 * - Date: "2026-06-15", Slot: "11:30 AM - 12:00 PM IST"
 * - Output: Start: "2026-06-15T11:30:00", End: "2026-06-15T12:00:00"
 */
export function getStartAndEndTimes(dateStr: string, timeSlotStr: string): { startIso: string; endIso: string } {
  // If instant or unrecognized formatting, default to now and now + 30 mins
  if (timeSlotStr.toLowerCase().includes("live now") || !timeSlotStr.includes("-")) {
    const start = new Date();
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    return {
      startIso: start.toISOString(),
      endIso: end.toISOString()
    };
  }

  try {
    const parts = timeSlotStr.replace(" IST", "").split("-");
    const startPart = parts[0].trim(); // "11:30 AM"
    const endPart = parts[1].trim();   // "12:00 PM"

    const parseToIso = (timeStr: string): string => {
      const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      if (!match) throw new Error("Invalid time format");
      
      let hrs = parseInt(match[1], 10);
      const mins = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();

      if (ampm === "PM" && hrs < 12) hrs += 12;
      if (ampm === "AM" && hrs === 12) hrs = 0;

      const hrsFormatted = String(hrs).padStart(2, "0");
      const minsFormatted = String(mins).padStart(2, "0");
      
      return `${dateStr}T${hrsFormatted}:${minsFormatted}:00`;
    };

    return {
      startIso: parseToIso(startPart),
      endIso: parseToIso(endPart)
    };
  } catch (error) {
    console.error("Failed to parse timeslot, fallback to generic hour slots:", error);
    // Fallback: Default to midday
    return {
      startIso: `${dateStr}T12:00:00`,
      endIso: `${dateStr}T12:30:00`
    };
  }
}

/**
 * Creates a consultation event on the user's Google Calendar with an integrated Google Meet session.
 */
export async function createCalendarConsultation(
  accessToken: string,
  details: {
    type: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }
): Promise<CalendarEventResponse> {
  const { startIso, endIso } = getStartAndEndTimes(details.date, details.timeSlot);

  // Construct Google Calendar Event body
  const eventBody = {
    summary: `Mangalam Ayurveda: ${details.type}`,
    description: `Synchronized Traditional Consultation Session\n\nClinical Discipline: ${details.type}\nTarget Schedule: ${details.timeSlot}\n\nPatient Imbalance Notes:\n${details.notes || "None provided"}\n\nClinical Counter Helplines: 9258240603`,
    start: {
      dateTime: startIso,
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: endIso,
      timeZone: 'Asia/Kolkata',
    },
    conferenceData: {
      createRequest: {
        requestId: `mab-cons-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 1440 },
        { method: 'popup', minutes: 30 },
      ],
    },
  };

  const calendarUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1';

  try {
    const response = await fetch(calendarUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Google Calendar API returned status ${response.status}`);
    }

    const data = await response.json();

    // Trace Meet conference entry points
    let meetingUri = '';
    let meetingCode = '';

    const entryPoints = data.conferenceData?.entryPoints || [];
    const videoEntryPoint = entryPoints.find((ep: any) => ep.entryPointType === 'video');
    
    if (videoEntryPoint) {
      meetingUri = videoEntryPoint.uri;
      meetingCode = meetingUri.replace('https://meet.google.com/', '');
    } else {
      // Static fallback if auto-conference creation is disabled or pending
      meetingUri = data.htmlLink;
      meetingCode = 'See Calendar Event';
    }

    return {
      id: data.id,
      htmlLink: data.htmlLink,
      meetingUri,
      meetingCode,
      start: startIso,
      end: endIso,
    };
  } catch (error) {
    console.error('Error in createCalendarConsultation:', error);
    throw error;
  }
}
