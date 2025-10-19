import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Constants

const periods: { [key: number]: string[] } = {
  1: ['07:00', '07:50'],
  2: ['08:00', '08:50'],
  3: ['09:00', '09:50'],
  4: ['10:00', '10:50'],
  5: ['13:00', '13:50'],
  6: ['14:00', '14:50'],
  7: ['15:00', '15:50'],
  8: ['16:00', '16:50'],
  9: ['17:30', '18:20'],
  10: ['18:25', '19:15'],
  11: ['19:20', '20:10'],
  12: ['20:15', '21:05'],
};


// Parse ICS time format to DateTime object
function parseICSTime(timeString: string): Date | null {
const cleanTime = timeString.trim().replace(/Z+$/, 'Z');

const match = cleanTime.match(/^(\d{8})T(\d{6})(Z)?$/);
if (!match) return null;

const [, date, time, isUTC] = match;
const year = date.slice(0, 4);
  const month = date.slice(4, 6);
const day = date.slice(6, 8);
const hour = time.slice(0, 2);
const minute = time.slice(2, 4);
const second = time.slice(4, 6);

try {
// Parse as UTC time
return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
} catch (e) {
console.error('Error parsing ICS time:', e);
return null;
}
}

// Parse ICS content into events array
function parseICSContent(content: string): any[] {
  const lines = content.replace(/\r/g, '').split('\n');
  const events = [];
  let currentEvent: any = {};
  let inEvent = false;

  for (const line of lines) {
    const trimmed = line.trim();

    switch (trimmed) {
      case 'BEGIN:VEVENT':
        inEvent = true;
        currentEvent = {};
        break;

      case 'END:VEVENT':
        if (inEvent) {
          const event = {
            title: currentEvent.SUMMARY || '(No title)',
            start: parseICSTime(currentEvent.DTSTART || ''),
            end: parseICSTime(currentEvent.DTEND || ''),
            loc: currentEvent.LOCATION || ''
          };

          if (event.start && event.end) {
            events.push(event);
          }
        }
        inEvent = false;
        break;

      default:
        if (inEvent) {
          const parts = line.split(':', 2);
          if (parts.length === 2) {
            const key = parts[0].split(';')[0];
            currentEvent[key] = parts[1];
          }
        }
        break;
    }
  }

  return events;
}

// Get current week's date range
function getCurrentWeekRange(): { start: Date; end: Date } {
  const today = new Date();

  // Get Monday of current week (same logic as PHP 'monday this week')
  const weekStart = new Date(today);
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days, otherwise calculate days to Monday
  weekStart.setDate(today.getDate() + daysToMonday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { start: weekStart, end: weekEnd };
}

// Map events to periods and days
function mapEventsToPeriods(events: any[], periods: any, weekRange: any): any {
  // Filter events for current week
  const weekEvents = events.filter(e =>
    e.start >= weekRange.start && e.start <= weekRange.end
  );

  // Group by day
  const eventsByDay: any = {};
  for (const event of weekEvents) {
    const dayKey = event.start.getDay() || 7; // Convert Sunday (0) to 7
    if (!eventsByDay[dayKey]) eventsByDay[dayKey] = [];
    eventsByDay[dayKey].push(event);
  }

  // Map to periods
  const periodEvents: any = {};
  for (const [dayKey, dayEvents] of Object.entries(eventsByDay)) {
    for (const event of dayEvents as any[]) {
      for (const [periodNum, timeRange] of Object.entries(periods) as [string, string[]][]) {
        const periodStart = new Date(event.start);
        const [startHour, startMin] = timeRange[0].split(':').map(Number);
        periodStart.setHours(startHour, startMin, 0, 0);

        const periodEnd = new Date(event.start);
        const [endHour, endMin] = timeRange[1].split(':').map(Number);
        periodEnd.setHours(endHour, endMin, 0, 0);

        // If event overlaps with period, clip it
        if (event.start < periodEnd && event.end > periodStart) {
          const clipped = {
            ...event,
            start: event.start > periodStart ? event.start : periodStart,
            end: event.end < periodEnd ? event.end : periodEnd
          };

          if (!periodEvents[periodNum]) periodEvents[periodNum] = {};
          if (!periodEvents[periodNum][dayKey]) periodEvents[periodNum][dayKey] = [];
          periodEvents[periodNum][dayKey].push(clipped);
        }
      }
    }
  }

  return periodEvents;
}

// Generate color for subjects
const subjectColors: { [key: string]: string } = {};
function colorOf(title: string): string {
  if (!subjectColors[title]) {
    const hash = require('crypto').createHash('md5').update(title).digest('hex');
    const hue = parseInt(hash.slice(0, 4), 16) % 360;
    subjectColors[title] = `hsl(${hue},70%,40%)`;
  }
  return subjectColors[title];
}

export async function GET() {
  try {
    // Validate ICS file exists
    const icsPath = path.join(process.cwd(), 'public', '2025-2026.1.ics');
    if (!fs.existsSync(icsPath)) {
      return NextResponse.json({ error: 'Schedule file not found' }, { status: 404 });
    }

    const content = fs.readFileSync(icsPath, 'utf-8');
    if (!content.trim()) {
      return NextResponse.json({ error: 'Schedule file is empty' }, { status: 422 });
    }

    const events = parseICSContent(content);
    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'No events found in schedule' }, { status: 422 });
    }

    const weekRange = getCurrentWeekRange();
    const periodEvents = mapEventsToPeriods(events, periods, weekRange);

    const weekStart = weekRange.start;
    const weekEnd = weekRange.end;

    // Format response with proper date strings
    const response = {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      periods,
      periodEvents,
      subjectColors
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('TKB API Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}
