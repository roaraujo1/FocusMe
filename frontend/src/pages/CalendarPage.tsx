import { useState } from 'react'
import { Link } from 'react-router'
import DaySessions from '../components/DaySessions'
import MonthGrid from '../components/MonthGrid'
import { groupByDate, monthKey } from '../calendar'
import { toLocalDateString } from '../time'
import { useFocusSessions } from '../useFocusSessions'

export default function CalendarPage() {
  const { sessions, loading, error } = useFocusSessions()

  // The month on screen. Starts at the current month.
  const [shown, setShown] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  // Worked out once when the page opens, not on every render.
  const [today] = useState(() => toLocalDateString(new Date()))

  // Recalculated from the raw sessions on every render; never stored.
  const sessionsByDate = groupByDate(sessions)
  const key = monthKey(shown.year, shown.month)
  const monthIsEmpty = !sessions.some((s) => s.session_date.startsWith(key))

  // step = -1 for previous month, +1 for next.
  // new Date() handles the year change (month 12 → January next year).
  function changeMonth(step: number) {
    const d = new Date(shown.year, shown.month + step, 1)
    setShown({ year: d.getFullYear(), month: d.getMonth() })
    setSelectedDate(null)
  }

  const label = new Date(shown.year, shown.month, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="wide">
      <p>
        <Link to="/">← Back to timer</Link>
      </p>
      <h1>Calendar</h1>

      <div className="month-nav">
        <button onClick={() => changeMonth(-1)}>‹ Prev</button>
        <strong>{label}</strong>
        <button onClick={() => changeMonth(1)}>Next ›</button>
      </div>

      {loading && <p>Loading sessions…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && monthIsEmpty && <p>No sessions this month.</p>}

      <MonthGrid
        year={shown.year}
        month={shown.month}
        today={today}
        sessionsByDate={sessionsByDate}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {selectedDate && (
        <DaySessions date={selectedDate} sessions={sessionsByDate.get(selectedDate) ?? []} />
      )}
    </main>
  )
}
