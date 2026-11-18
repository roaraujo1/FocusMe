import type { FocusSession } from '../api'
import { totalSeconds } from '../calendar'
import { formatDuration } from '../time'

type Props = {
  date: string // "YYYY-MM-DD"
  sessions: FocusSession[]
}

// The list under the grid for the day the user clicked.
export default function DaySessions({ date, sessions }: Props) {
  return (
    <section>
      <h2>{date}</h2>
      {sessions.length === 0 ? (
        <p>No sessions on this day.</p>
      ) : (
        <>
          <p>Total: {formatDuration(totalSeconds(sessions))}</p>
          <ol>
            {sessions.map((s) => (
              <li key={s.id}>{formatDuration(s.time)}</li>
            ))}
          </ol>
        </>
      )}
    </section>
  )
}
