"use client";

import { useEffect, useState, useCallback } from "react";

interface Event {
  title: string;
  start: string;
  end: string;
  loc: string;
  period?: string;
  periodTime?: string[];
}

interface PeriodData {
  [dayKey: string]: Event[];
}

interface ScheduleData {
  weekStart: string;
  weekEnd: string;
  periods: { [key: number]: string[] };
  periodEvents: { [key: string]: PeriodData };
  subjectColors: { [key: string]: string };
}

export default function TKB() {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/tkb");

      if (!res.ok) {
        // Try to get the detailed error message from the API response
        try {
          const errorData = await res.json();
          throw new Error(
            errorData.message ||
              errorData.error ||
              `HTTP ${res.status}: ${res.statusText}`
          );
        } catch (jsonError) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
      }

      const data = await res.json();
      setScheduleData(data);
    } catch (error) {
      console.error("Error loading schedule:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load schedule"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  // Function to generate HSL colors like the PHP version
  const getFallbackColor = useCallback((subjectTitle: string) => {
    // Improved hash function for better color distribution
    let hash = 0;
    for (let i = 0; i < subjectTitle.length; i++) {
      const char = subjectTitle.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use a more sophisticated approach to distribute colors evenly
    // Multiply by a prime number and take modulo for better distribution
    const hue = Math.abs(hash * 31) % 360;

    // HSL color with 70% saturation and 45% lightness for better visibility
    return `hsl(${hue}, 75%, 45%)`;
  }, []);

  const formatEvent = useCallback(
    (event: Event, subjectColors: { [key: string]: string }) => {
      const bg = subjectColors[event.title] || getFallbackColor(event.title);
      const title = event.title;
      const location = event.loc;

      // Use times directly without timezone conversion
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);

      const startTime = startDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = endDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <div
          key={`${event.start}-${event.end}`}
          className="event"
          style={{ background: bg }}
        >
          <b>{title}</b>
          <div className="small">{location}</div>
          <div className="small">
            {startTime} – {endTime}
          </div>
        </div>
      );
    },
    [getFallbackColor]
  );

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading schedule...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <header className="profile">
          <h1>Thời khoá biểu</h1>
          <p className="subtitle">Weekly Schedule Viewer</p>
        </header>

        <main className="section">
          <div className="content-card" style={{ textAlign: "center" }}>
            <h3
              style={{ color: "var(--accent-primary)", marginBottom: "20px" }}
            >
              📅 Schedule Not Configured
            </h3>
            <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>{error}</p>
            <div style={{ marginTop: "30px" }}>
              <button onClick={loadSchedule} style={{ marginRight: "10px" }}>
                🔄 Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          No schedule data available
        </div>
      </div>
    );
  }

  const { weekStart, weekEnd, periods, periodEvents, subjectColors } =
    scheduleData;
  const labels = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

  const weekStartDate = new Date(weekStart);
  const weekEndDate = new Date(weekEnd);

  return (
    <div className="container tkb full">
      <header className="profile">
        <h1>Thời khoá biểu</h1>
        <p className="subtitle">
          {weekStartDate.toLocaleDateString("vi-VN")} –{" "}
          {weekEndDate.toLocaleDateString("vi-VN")}
        </p>
      </header>

      <main className="section">
        <div className="content-card">
          {/* Mobile card layout - organized by day */}
          <div className="mobile-tkb-cards" style={{ display: "none" }}>
            {labels.map((label, dayIndex) => {
              const dayKey = (dayIndex + 1).toString();
              const dayDate = new Date(weekStartDate);
              dayDate.setDate(weekStartDate.getDate() + dayIndex);

              // Collect all events for this day across all periods
              const dayAllEvents: Event[] = [];
              Object.entries(periodEvents).forEach(
                ([periodNum, periodData]) => {
                  const periodDayEvents = periodData[dayKey] || [];
                  periodDayEvents.forEach((event: Event) => {
                    dayAllEvents.push({
                      ...event,
                      period: periodNum,
                      periodTime: periods[Number(periodNum)],
                    });
                  });
                }
              );

              // Sort events by start time
              dayAllEvents.sort(
                (a, b) =>
                  new Date(a.start).getTime() - new Date(b.start).getTime()
              );

              return (
                <div key={dayIndex} className="day-section">
                  <div className="day-header">
                    <div className="day-title">{label}</div>
                    <div className="day-date">
                      {dayDate.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="day-events">
                    {dayAllEvents.length > 0 ? (
                      dayAllEvents.map((event) => (
                        <div
                          key={`${event.start}-${event.end}`}
                          className="event-card"
                          style={{
                            borderLeft: `4px solid ${
                              subjectColors[event.title] ||
                              getFallbackColor(event.title)
                            }`,
                          }}
                        >
                          <div className="event-title">{event.title}</div>
                          <div className="event-location">{event.loc}</div>
                          <div className="event-period">
                            Tiết {event.period} • {event.periodTime?.[0]}–
                            {event.periodTime?.[1]}
                          </div>
                          <div className="event-time">
                            {new Date(event.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            –{" "}
                            {new Date(event.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-events">Không có lớp</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table layout */}
          <table className="fade-in">
            <thead>
              <tr>
                <th className="period">Tiết</th>
                {labels.map((label, i) => {
                  const date = new Date(weekStartDate);
                  date.setDate(weekStartDate.getDate() + i);
                  return (
                    <th key={i}>
                      {label}
                      <br />
                      <span className="small">
                        {date.toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Object.entries(periods).map(([periodNum, timeRange]) => (
                <tr key={periodNum}>
                  <td className="period">
                    Tiết {periodNum}
                    <br />
                    <span className="small">
                      {timeRange[0]}–{timeRange[1]}
                    </span>
                  </td>
                  {Array.from({ length: 7 }, (_, dow) => {
                    const dayKey = (dow + 1).toString();
                    const events = periodEvents[periodNum]?.[dayKey] || [];
                    return (
                      <td key={dow}>
                        {events.map((event) =>
                          formatEvent(event, subjectColors)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
