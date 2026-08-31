export function getTodayDateString(): string {
  // Use ISO date format YYYY-MM-DD
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d || 1);
}

export function formatDate(dateStr: string | null | undefined, formatStyle: 'short' | 'medium' | 'long' = 'medium'): string {
  if (!dateStr) return '—';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return dateStr;
    const date = new Date(y, m - 1, d);

    if (formatStyle === 'short') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
    }
    if (formatStyle === 'long') {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    // medium default e.g. "May 24, 2024" or "15 Jan 2022"
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function addDaysToDate(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysDifference(targetDateStr: string, fromDateStr: string = getTodayDateString()): number {
  const target = parseDate(targetDateStr);
  const from = parseDate(fromDateStr);
  
  // Set both to midnight UTC to avoid daylight saving issues
  const diffTime = target.getTime() - from.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateAge(dobStr: string, asOfDateStr: string = getTodayDateString()): {
  years: number;
  months: number;
  days: number;
  text: string;
  shortText: string;
} {
  if (!dobStr) {
    return { years: 0, months: 0, days: 0, text: 'Unknown', shortText: '0m' };
  }

  const birthDate = parseDate(dobStr);
  const asOfDate = parseDate(asOfDateStr);

  let years = asOfDate.getFullYear() - birthDate.getFullYear();
  let months = asOfDate.getMonth() - birthDate.getMonth();
  let days = asOfDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    // Get days in previous month
    const prevMonthDate = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), 0);
    days += prevMonthDate.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) {
    return { years: 0, months: 0, days: 0, text: 'Newborn', shortText: '0d' };
  }

  let text = '';
  let shortText = '';

  if (years >= 2) {
    if (months > 0) {
      text = `${years} years, ${months} ${months === 1 ? 'month' : 'months'}`;
      shortText = `${years}y ${months}m`;
    } else {
      text = `${years} years`;
      shortText = `${years}y`;
    }
  } else if (years === 1) {
    if (months > 0) {
      text = `1 year, ${months} ${months === 1 ? 'month' : 'months'}`;
      shortText = `1y ${months}m`;
    } else {
      text = '1 year';
      shortText = '1y';
    }
  } else if (months >= 1) {
    text = `${months} ${months === 1 ? 'month' : 'months'}`;
    shortText = `${months}m`;
    if (days > 0 && months < 3) {
      text += `, ${days} ${days === 1 ? 'day' : 'days'}`;
      shortText = `${months}m ${days}d`;
    }
  } else {
    if (days === 0) {
      text = 'Newborn (Today)';
      shortText = 'Newborn';
    } else {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      if (weeks > 0) {
        text = `${weeks} ${weeks === 1 ? 'week' : 'weeks'}${remainingDays ? `, ${remainingDays}d` : ''}`;
        shortText = `${weeks}w`;
      } else {
        text = `${days} ${days === 1 ? 'day' : 'days'}`;
        shortText = `${days}d`;
      }
    }
  }

  return { years, months, days, text, shortText };
}

export function formatRelativeCountdown(dueDateStr: string, todayStr: string = getTodayDateString()): {
  text: string;
  daysDiff: number;
  isOverdue: boolean;
  isToday: boolean;
  isDueSoon: boolean;
} {
  const daysDiff = getDaysDifference(dueDateStr, todayStr);
  const isToday = daysDiff === 0;
  const isOverdue = daysDiff < 0;
  const isDueSoon = daysDiff > 0 && daysDiff <= 7;

  let text = '';
  if (isToday) {
    text = 'Due Today';
  } else if (isOverdue) {
    const absDays = Math.abs(daysDiff);
    if (absDays === 1) {
      text = 'Overdue by 1 day';
    } else if (absDays < 30) {
      text = `Overdue by ${absDays} days`;
    } else if (absDays < 365) {
      const mos = Math.round(absDays / 30);
      text = `Overdue by ~${mos} ${mos === 1 ? 'month' : 'months'}`;
    } else {
      const yrs = (absDays / 365).toFixed(1);
      text = `Overdue by ${yrs} yrs`;
    }
  } else {
    if (daysDiff === 1) {
      text = 'in 1 day';
    } else if (daysDiff < 30) {
      text = `in ${daysDiff} days`;
    } else if (daysDiff < 60) {
      text = 'in ~1 month';
    } else if (daysDiff < 365) {
      const mos = Math.round(daysDiff / 30);
      text = `in ~${mos} months`;
    } else {
      text = `in ${(daysDiff / 365).toFixed(1)} yrs`;
    }
  }

  return { text, daysDiff, isOverdue, isToday, isDueSoon };
}
