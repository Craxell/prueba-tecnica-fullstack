import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { api, getAuthToken, setAuthToken } from '../api/client'

type AuthValue = {
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

type JwtBody = { access_token?: string; token?: string }

function tokenFromBody(data: JwtBody): string | null {
  return data.access_token ?? data.token ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(getAuthToken())
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<JwtBody>('/auth/login', { email, password })
    const t = tokenFromBody(data)
    if (!t) throw new Error('Login sin token')
    setAuthToken(t)
    setToken(t)
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<JwtBody>('/auth/register', { email, password })
    const t = tokenFromBody(data)
    if (t) {
      setAuthToken(t)
      setToken(t)
    }
  }, [])

  const logout = useCallback(() => {
    setAuthToken(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth: fuera de AuthProvider')
  return ctx
}
