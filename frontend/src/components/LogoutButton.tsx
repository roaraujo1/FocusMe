import { useNavigate } from 'react-router'
import { clearToken } from '../auth'

export default function LogoutButton() {
  const navigate = useNavigate()

  function handleLogout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  return <button onClick={handleLogout}>Log out</button>
}
