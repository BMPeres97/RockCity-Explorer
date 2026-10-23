/**
 * RockCity Explorer - Backend Operational Status Utility
 * Timezone: Asia/Colombo (Sri Lanka Standard Time, UTC+05:30)
 */

const SL_TIMEZONE = 'Asia/Colombo';

const timeStringToMinutes = (str) => {
  if (!str || typeof str !== 'string') return null;
  const match = str.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
};

/**
 * Check if a place is open in Asia/Colombo timezone
 * Returns true if open, false if closed, null if unknown schedule
 */
const checkIsOpenNow = (openingHours) => {
  // Do NOT mark missing or unknown schedule as open!
  if (!openingHours) return null;

  if (typeof openingHours === 'string') {
    const text = openingHours.trim().toLowerCase();
    if (!text || text === 'unknown' || text === 'n/a') return null;
    if (text.includes('24 hour') || text.includes('always open') || text.includes('open 24/7')) return true;
    const match = text.match(/(\d{1,2}:\d{2})\s*[-–to]+\s*(\d{1,2}:\d{2})/);
    if (match) {
      openingHours = { open: match[1], close: match[2], alwaysOpen: false };
    } else {
      return null;
    }
  }

  if (openingHours.alwaysOpen) return true;

  try {
    const now = new Date();
    const weekday = now.toLocaleDateString('en-US', {
      timeZone: SL_TIMEZONE,
      weekday: 'long'
    });
    const weekdayLower = weekday.toLowerCase();

    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: SL_TIMEZONE,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    const [h, m] = timeStr.split(':').map(Number);
    const currentMins = h * 60 + m;

    // Day-by-day map check
    if (openingHours[weekdayLower] !== undefined) {
      const daySchedule = openingHours[weekdayLower];
      if (
        daySchedule === null ||
        daySchedule === false ||
        daySchedule === 'closed' ||
        (typeof daySchedule === 'object' && daySchedule.closed)
      ) {
        return false;
      }
      if (typeof daySchedule === 'object' && daySchedule.open && daySchedule.close) {
        const openM = timeStringToMinutes(daySchedule.open);
        const closeM = timeStringToMinutes(daySchedule.close);
        if (openM !== null && closeM !== null) {
          if (closeM < openM) {
            return currentMins >= openM || currentMins <= closeM;
          }
          return currentMins >= openM && currentMins <= closeM;
        }
      }
    }

    // Weekly schedule object { open, close, days }
    if (openingHours.open && openingHours.close) {
      if (openingHours.days && Array.isArray(openingHours.days) && openingHours.days.length > 0) {
        const openDays = openingHours.days.map((d) => d.toLowerCase());
        if (!openDays.includes(weekdayLower)) {
          return false;
        }
      }

      const openM = timeStringToMinutes(openingHours.open);
      const closeM = timeStringToMinutes(openingHours.close);
      if (openM === null || closeM === null) return null;

      if (closeM < openM) {
        return currentMins >= openM || currentMins <= closeM;
      }
      return currentMins >= openM && currentMins <= closeM;
    }

    return null;
  } catch (err) {
    return null;
  }
};

module.exports = {
  checkIsOpenNow,
  SL_TIMEZONE
};
