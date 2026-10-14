/**
 * Date utility helpers for Student Study Planner
 */

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr?: string | null): Date {
  if (!dateStr || typeof dateStr !== 'string') {
    return new Date();
  }
  const cleanStr = dateStr.split('T')[0];
  const parts = cleanStr.split('-').map(Number);
  if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function formatDate(dateStr?: string | null, options?: { month?: 'short' | 'long' | 'numeric', includeYear?: boolean }): string {
  if (!dateStr) return '';
  const d = parseDate(dateStr);
  const month = options?.month || 'short';
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthNamesLong = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const m = month === 'long' ? monthNamesLong[d.getMonth()] : monthNamesShort[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  if (options?.includeYear) {
    return `${day} ${m} ${year}`;
  }
  return `${day} ${m}`;
}

export function getDaysRemaining(targetDateStr?: string | null): {
  days: number;
  label: string;
  isPast: boolean;
  isToday: boolean;
  isTomorrow: boolean;
} {
  if (!targetDateStr) {
    return {
      days: 0,
      label: 'Date not set',
      isPast: false,
      isToday: false,
      isTomorrow: false,
    };
  }

  const todayStr = getTodayDateString();
  const today = parseDate(todayStr);
  const target = parseDate(targetDateStr);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: diffDays,
      label: 'Exam Completed',
      isPast: true,
      isToday: false,
      isTomorrow: false,
    };
  } else if (diffDays === 0) {
    return {
      days: 0,
      label: 'Today',
      isPast: false,
      isToday: true,
      isTomorrow: false,
    };
  } else if (diffDays === 1) {
    return {
      days: 1,
      label: '1 day remaining',
      isPast: false,
      isToday: false,
      isTomorrow: true,
    };
  } else {
    return {
      days: diffDays,
      label: `${diffDays} days remaining`,
      isPast: false,
      isToday: false,
      isTomorrow: false,
    };
  }
}

export function isDateToday(dateStr: string): boolean {
  return dateStr === getTodayDateString();
}

export function isDateThisWeek(dateStr: string): boolean {
  const target = parseDate(dateStr);
  const today = parseDate(getTodayDateString());
  
  // Start of current week (Monday or Sunday - let's use current week Monday to Sunday)
  const dayOfWeek = today.getDay(); // 0 is Sunday
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return target >= startOfWeek && target <= endOfWeek;
}

export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hoursStr, minutesStr] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';
  if (isNaN(hours)) return time24;
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  return `${hours}:${minutes} ${ampm}`;
}

export function getRelativeOffsetDate(offsetDays: number): string {
  const now = new Date();
  now.setDate(now.getDate() + offsetDays);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
