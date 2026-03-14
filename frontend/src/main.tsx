import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="bottom-right"
        closeButton
        richColors
        toastOptions={{
          classNames: {
            toast:
              'sonner-toast !bg-[var(--bg)] !border-[var(--border)] !text-[var(--text-h)] !shadow-lg',
            title: '!text-[var(--text-h)]',
            description: '!text-[var(--text)]',
            closeButton: '!bg-[var(--code-bg)] !text-[var(--text-h)] !border-[var(--border)]',
          },
        }}
      />
    </AuthProvider>
  </StrictMode>,
)
