/**
 * RockCity Explorer - Operational Status Utility
 * SRS Section 25: Open Now Logic
 * Timezone: Asia/Colombo (Sri Lanka Standard Time, UTC+05:30)
 * 
 * Requirements:
 * 1. Asia/Colombo timezone used for all evaluations.
 * 2. Display: "Open Now" or "Closed" (or "Hours Unknown" for missing/unverified schedules).
 * 3. Handle places with:
 *    - Closed days
 *    - Full-day opening (24/7)
 *    - Different weekday hours
 *    - Missing/unknown hours
 * 4. Do NOT incorrectly mark an unknown schedule as definitely open.
 */

export const SL_TIMEZONE = 'Asia/Colombo';

/**
 * Get current date and time parts in Sri Lanka timezone (Asia/Colombo)
 */
export const getSriLankaCurrentTime = () => {
  const now = new Date();
  
  // Format day of week in Sri Lanka
  const weekday = now.toLocaleDateString('en-US', {
    timeZone: SL_TIMEZONE,
    weekday: 'long'
  }); // "Monday", "Tuesday", etc.

  // Format time HH:mm in 24-hour format
  const timeStr = now.toLocaleTimeString('en-US', {
    timeZone: SL_TIMEZONE,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });

  const [hours, minutes] = timeStr.split(':').map(Number);
  const currentMinutes = hours * 60 + minutes;

  return {
    weekday,
    timeStr,
    currentMinutes,
    now
  };
};

/**
 * Convert "HH:mm" time string to minutes from midnight
 */
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
 * Evaluate place opening status against Sri Lanka current time
 * @param {Object|string} openingHours 
 * @returns {Object} { isOpen: boolean|null, status: 'open'|'closed'|'unknown', label: 'Open Now'|'Closed'|'Hours Unknown', detail: string }
 */
export const getPlaceOpenStatus = (openingHours) => {
  // Missing or unknown hours - Do NOT mark as definitely open!
  if (!openingHours) {
    return {
      isOpen: null,
      status: 'unknown',
      label: 'Hours Unknown',
      detail: 'Schedule not verified'
    };
  }

  // If string schedule provided
  if (typeof openingHours === 'string') {
    const text = openingHours.trim().toLowerCase();
    if (!text || text === 'unknown' || text === 'n/a' || text === 'not specified') {
      return {
        isOpen: null,
        status: 'unknown',
        label: 'Hours Unknown',
        detail: 'Schedule not verified'
      };
    }
    if (text.includes('24 hour') || text.includes('always open') || text.includes('open 24/7')) {
      return {
        isOpen: true,
        status: 'open',
        label: 'Open Now',
        detail: 'Open 24 Hours / Full-day'
      };
    }
    // Attempt to extract "HH:mm - HH:mm"
    const match = text.match(/(\d{1,2}:\d{2})\s*[-–to]+\s*(\d{1,2}:\d{2})/);
    if (match) {
      openingHours = { open: match[1], close: match[2], alwaysOpen: false };
    } else {
      return {
        isOpen: null,
        status: 'unknown',
        label: 'Hours Unknown',
        detail: openingHours
      };
    }
  }

  // Full-day / 24-7 opening
  if (openingHours.alwaysOpen) {
    return {
      isOpen: true,
      status: 'open',
      label: 'Open Now',
      detail: 'Open 24 Hours / Full-day'
    };
  }

  const { weekday, currentMinutes } = getSriLankaCurrentTime();
  const weekdayLower = weekday.toLowerCase();

  // Support Format B: Day-by-day schedule map (e.g. openingHours.monday, openingHours.friday)
  if (openingHours[weekdayLower] !== undefined) {
    const daySchedule = openingHours[weekdayLower];

    // Closed day check
    if (
      daySchedule === null ||
      daySchedule === false ||
      daySchedule === 'closed' ||
      (typeof daySchedule === 'object' && daySchedule.closed)
    ) {
      return {
        isOpen: false,
        status: 'closed',
        label: 'Closed',
        detail: `Closed on ${weekday}s`
      };
    }

    if (typeof daySchedule === 'object' && daySchedule.open && daySchedule.close) {
      const openMins = timeStringToMinutes(daySchedule.open);
      const closeMins = timeStringToMinutes(daySchedule.close);

      if (openMins !== null && closeMins !== null) {
        let isOpen = false;
        if (closeMins < openMins) {
          // Overnight span (e.g. 20:00 to 02:00)
          isOpen = currentMinutes >= openMins || currentMinutes <= closeMins;
        } else {
          isOpen = currentMinutes >= openMins && currentMinutes <= closeMins;
        }

        return isOpen
          ? { isOpen: true, status: 'open', label: 'Open Now', detail: `Closes at ${daySchedule.close}` }
          : { isOpen: false, status: 'closed', label: 'Closed', detail: `Opens at ${daySchedule.open}` };
      }
    }
  }

  // Support Format A: Standard weekly schedule object { open, close, days }
  if (openingHours.open && openingHours.close) {
    // Check if place is closed on the current day
    if (openingHours.days && Array.isArray(openingHours.days) && openingHours.days.length > 0) {
      const openDaysFormatted = openingHours.days.map((d) => d.toLowerCase());
      if (!openDaysFormatted.includes(weekdayLower)) {
        return {
          isOpen: false,
          status: 'closed',
          label: 'Closed',
          detail: `Closed on ${weekday}s`
        };
      }
    }

    const openMins = timeStringToMinutes(openingHours.open);
    const closeMins = timeStringToMinutes(openingHours.close);

    if (openMins === null || closeMins === null) {
      return {
        isOpen: null,
        status: 'unknown',
        label: 'Hours Unknown',
        detail: 'Unverified schedule'
      };
    }

    let isOpen = false;
    if (closeMins < openMins) {
      isOpen = currentMinutes >= openMins || currentMinutes <= closeMins;
    } else {
      isOpen = currentMinutes >= openMins && currentMinutes <= closeMins;
    }

    if (isOpen) {
      return {
        isOpen: true,
        status: 'open',
        label: 'Open Now',
        detail: `Closes at ${openingHours.close}`
      };
    } else {
      return {
        isOpen: false,
        status: 'closed',
        label: 'Closed',
        detail: `Opens at ${openingHours.open}`
      };
    }
  }

  // If none of the conditions matched, schedule is unknown - NEVER default to true!
  return {
    isOpen: null,
    status: 'unknown',
    label: 'Hours Unknown',
    detail: 'Check hours before visiting'
  };
};
