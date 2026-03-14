import { useCallback, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { styles } from '../../constants/styles'
import { PokemonDetailPanel } from '../pokemon-detail/components/PokemonDetailPanel'

export function PokemonEditPage() {
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
  const link = `${styles.radius.btn} inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold ${styles.btnGhost}`
  return (
    <div className={`${styles.pageBg} px-4 py-8 sm:px-6`}>
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex flex-wrap gap-2">
          <Link to={`/app/pokemon/${favoriteId}`} className={link}><ArrowLeft className="h-4 w-4" />Ver detalle</Link>
          <Link to="/app" className={link}>Dashboard</Link>
        </div>
        <div className={`${styles.card} p-5 sm:p-6`}>
          <PokemonDetailPanel favoriteId={favoriteId} mode="edit" on401={on401} />
        </div>
      </div>
    </div>
  )
}
