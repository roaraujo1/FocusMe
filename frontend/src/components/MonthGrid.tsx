import type { FocusSession } from '../api'
import { monthCells, totalSeconds } from '../calendar'
import { formatDuration } from '../time'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Props = {
  year: number
  month: number // 0-based
  today: string // "YYYY-MM-DD", gets a border
  sessionsByDate: Map<string, FocusSession[]>
  selectedDate: string | null
  onSelectDate: (date: string) => void
}

// A 7-column grid. Each day shows its number and that day's total, if any.
export default function MonthGrid(props: Props) {
  const { year, month, today, sessionsByDate, selectedDate, onSelectDate } = props
  return (
    <div className="month-grid">
      {WEEKDAYS.map((d) => (
        <div key={d} className="weekday">
          {d}
        </div>
      ))}

      {monthCells(year, month).map((date, i) => {
        if (date === null) return <div key={`blank-${i}`} />

        const daySessions = sessionsByDate.get(date) ?? []
        const total = totalSeconds(daySessions)
        const classes = ['day', date === today && 'today', date === selectedDate && 'selected']

        return (
          <button
            key={date}
            className={classes.filter(Boolean).join(' ')}
            onClick={() => onSelectDate(date)}
          >
            <span>{Number(date.slice(8))}</span>
            {total > 0 && <span className="day-total">{formatDuration(total)}</span>}
          </button>
        )
      })}
    </div>
  )
}
