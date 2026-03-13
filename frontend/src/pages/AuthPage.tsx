import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { styles } from '../constants/styles'
import {
  PASSWORD_HINT,
  rhfPasswordMatch,
  rhfStrongPassword,
  validateStrongPassword,
} from '../validators/authPassword'
import { isAxiosError } from 'axios'

type Mode = 'login' | 'register'

type FormValues = {
  email: string
  password: string
  passwordConfirm: string
}

function apiErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const msg = err.response?.data?.message
    if (typeof msg === 'string') return msg
    if (Array.isArray(msg)) return msg.join(', ')
    if (err.response?.status === 401) return 'Credenciales inválidas.'
    if (err.response?.status === 409) return 'Ese email ya está registrado.'
    if (!err.response) return 'No se pudo conectar con el servidor.'
  }
  if (err instanceof Error) return err.message
  return 'Algo salió mal. Intenta de nuevo.'
}

export function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login, register, token } = useAuth()
  const navigate = useNavigate()

  const {
    register: registerField,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { email: '', password: '', passwordConfirm: '' },
  })

  if (token) {
    navigate('/app', { replace: true })
    return null
  }

  const onSubmit = async (data: FormValues) => {
    setError(null)
    if (mode === 'register') {
      const strong = validateStrongPassword(data.password)
      if (!strong.ok) {
        setError(strong.message)
        return
      }
      if (data.password !== data.passwordConfirm) {
        setError('Las contraseñas no coinciden.')
        return
      }
    }
    try {
      if (mode === 'login') await login(data.email, data.password)
      else await register(data.email, data.password)
      navigate('/app', { replace: true })
    } catch (e) {
      setError(apiErrorMessage(e))
    }
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
    setShowPassword(false)
    setShowPasswordConfirm(false)
    reset()
  }

  return (
    <div
      className={`${styles.pageBg} flex flex-col items-center justify-center px-4 py-10 sm:py-16`}
    >
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <div
          className={`flex h-14 w-14 items-center justify-center ${styles.radius.card} ${styles.accentMuted}`}
          aria-hidden
        >
          <Sparkles className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <h1 className={`text-2xl sm:text-3xl ${styles.heading}`}>
          Pokémon Favoritos
        </h1>
        <p className="max-w-sm text-sm text-[var(--text)]">
          Entra o crea cuenta para guardar tus Pokémon.
        </p>
      </div>

      <div
        className={`w-full max-w-[400px] p-6 sm:p-8 ${styles.card}`}
        role="main"
        aria-label="Autenticación"
      >
        <div
          className="mb-6 flex rounded-xl border border-[var(--border)] p-1"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
              mode === 'login' ? styles.tabActive : styles.tabInactive
            }`}
            onClick={() => switchMode('login')}
          >
            <LogIn className="h-4 w-4 shrink-0" />
            Iniciar sesión
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
              mode === 'register' ? styles.tabActive : styles.tabInactive
            }`}
            onClick={() => switchMode('register')}
          >
            <UserPlus className="h-4 w-4 shrink-0" />
            Registro
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-col ${styles.space.section}`}
          noValidate
        >
          {error && (
            <div
              className={`flex items-start gap-2 ${styles.error}`}
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.space.field}>
            <label htmlFor="auth-email" className={styles.label}>
              Email
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text)]/60"
                aria-hidden
              />
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                className={`${styles.input} pl-10`}
                placeholder="tu@email.com"
                {...registerField('email', {
                  required: 'El email es obligatorio',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email no válido',
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-left text-xs text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className={styles.space.field}>
            <label htmlFor="auth-password" className={styles.label}>
              Contraseña
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text)]/60"
                aria-hidden
              />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                className={`${styles.input} pl-10 pr-11`}
                placeholder="••••••••"
                {...registerField('password', {
                  required: 'La contraseña es obligatoria',
                  validate:
                    mode === 'register'
                      ? rhfStrongPassword
                      : (v) =>
                          v.length >= 1 || 'La contraseña es obligatoria',
                })}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--text)] hover:bg-[var(--code-bg)] hover:text-[var(--text-h)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden />
                )}
              </button>
            </div>
            {mode === 'register' && (
              <p className="text-left text-[11px] leading-snug text-[var(--text)]">
                {PASSWORD_HINT}
              </p>
            )}
            {errors.password && (
              <p className="text-left text-xs text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {mode === 'register' && (
            <div className={styles.space.field}>
              <label htmlFor="auth-password-confirm" className={styles.label}>
                Repetir contraseña
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text)]/60"
                  aria-hidden
                />
                <input
                  id="auth-password-confirm"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`${styles.input} pl-10 pr-11`}
                  placeholder="••••••••"
                  {...registerField('passwordConfirm', {
                    validate: (confirm) =>
                      rhfPasswordMatch(getValues('password'), confirm),
                  })}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--text)] hover:bg-[var(--code-bg)] hover:text-[var(--text-h)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  aria-label={
                    showPasswordConfirm
                      ? 'Ocultar repetir contraseña'
                      : 'Mostrar repetir contraseña'
                  }
                  onClick={() => setShowPasswordConfirm((s) => !s)}
                >
                  {showPasswordConfirm ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </div>
              {errors.passwordConfirm && (
                <p className="text-left text-xs text-red-600 dark:text-red-400">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-2 flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold transition-opacity disabled:opacity-60 ${styles.radius.btn} ${styles.accent}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === 'login' ? 'Entrando…' : 'Creando cuenta…'}
              </>
            ) : mode === 'login' ? (
              <>
                <LogIn className="h-4 w-4" />
                Entrar
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Crear cuenta
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
