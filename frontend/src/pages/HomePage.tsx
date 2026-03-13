import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { styles } from '../constants/styles'

export function HomePage() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate('/', { replace: true })
  }, [token, navigate])

  if (!token) return null

  return (
    <div
      className={`${styles.pageBg} flex flex-col items-center justify-center px-4 py-16`}
    >
      <h1 className={`mb-4 text-2xl ${styles.heading}`}>Inicio</h1>
      <p className="mb-4 text-sm text-[var(--text)]">Sesión activa.</p>
      <button
        type="button"
        onClick={() => {
          logout()
          navigate('/', { replace: true })
        }}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${styles.radius.btn} border border-[var(--border)] text-[var(--text-h)] hover:bg-[var(--code-bg)]`}
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </button>
    </div>
  )
}
