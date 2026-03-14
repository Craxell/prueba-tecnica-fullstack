import { useCallback, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { styles } from '../../constants/styles'
import { PokemonDetailPanel } from './components/PokemonDetailPanel'

export function PokemonDetailPage() {
  const { favoriteId } = useParams<{ favoriteId: string }>()
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const on401 = useCallback(() => {
    logout()
    navigate('/', { replace: true })
  }, [logout, navigate])
  useEffect(() => {
    if (!token) navigate('/', { replace: true })
  }, [token, navigate])
  if (!token || !favoriteId) return null
  return (
    <div className={`${styles.pageBg} px-4 py-8 sm:px-6`}>
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex flex-wrap gap-2">
          <Link to="/app" className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold ${styles.radius.btn} ${styles.btnGhost}`}>
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <Link to={`/app/pokemon/${favoriteId}/edit`} className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold ${styles.radius.btn} ${styles.accent}`}>
            <Pencil className="h-4 w-4" />
            Editar notas
          </Link>
        </div>
        <div className={`${styles.card} p-5 sm:p-6`}>
          <PokemonDetailPanel favoriteId={favoriteId} mode="view" on401={on401} />
        </div>
      </div>
    </div>
  )
}
