import { Link } from 'react-router'
import LogoutButton from '../components/LogoutButton'
import Timer from '../components/Timer'

export default function HomePage() {
  return (
    <main>
      <h1>Focus Me</h1>
      <Timer />
      <p>
        <Link to="/calendar">View calendar →</Link>
      </p>
      <LogoutButton />
    </main>
  )
}
