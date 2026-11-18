import { useEffect, useState } from 'react'

// Stopwatch logic, kept separate from the UI.
//
// We store the moment the timer started and compute elapsed time as
// "now - start". The interval only re-renders the screen; it does not
// count time itself. That keeps the time accurate even when the browser
// slows down timers in a background tab.
export function useStopwatch() {
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(0) // set for real by start()

  const running = startedAt !== null
  const elapsedMs = running ? now - startedAt : 0

  // While running, refresh `now` a few times per second.
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id) // runs on stop or when leaving the page
  }, [running])

  function start() {
    const t = Date.now()
    setStartedAt(t)
    setNow(t)
  }

  // Stops the timer and reports when it started and how long it ran.
  function stop(): { startedAt: Date; seconds: number } | null {
    if (startedAt === null) return null
    const seconds = Math.floor((Date.now() - startedAt) / 1000)
    const result = { startedAt: new Date(startedAt), seconds }
    setStartedAt(null)
    return result
  }

  return { running, elapsedMs, start, stop }
}
