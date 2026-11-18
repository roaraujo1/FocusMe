// Pure helpers for the calendar page: no React, no fetching.
import type { FocusSession } from './api'
import { toLocalDateString } from './time'

// Groups sessions by their "YYYY-MM-DD" date string.
// We use the string as-is and never turn it into a Date: new Date("2026-11-17")
// means midnight UTC, which is still Nov 16 in the Americas.
export function groupByDate(sessions: FocusSession[]): Map<string, FocusSession[]> {
  const groups = new Map<string, FocusSession[]>()
  for (const s of sessions) {
    const day = groups.get(s.session_date) ?? []
    day.push(s)
    groups.set(s.session_date, day)
  }
  return groups
}

// Adds up the seconds of a list of sessions.
export function totalSeconds(sessions: FocusSession[]): number {
  return sessions.reduce((sum, s) => sum + s.time, 0)
}

// The cells of a month grid, weeks starting on Sunday.
// Each cell is a "YYYY-MM-DD" string, or null for the blank cells
// before the 1st. `month` is 0-based (0 = January), like JavaScript's Date.
export function monthCells(year: number, month: number): (string | null)[] {
  const blanks = new Date(year, month, 1).getDay() // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate() // day 0 of next month = last day of this one

  const cells: (string | null)[] = Array(blanks).fill(null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(toLocalDateString(new Date(year, month, day)))
  }
  return cells
}

// (2026, 10) → "2026-11". A session is in that month if its
// session_date starts with this prefix.
export function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}
