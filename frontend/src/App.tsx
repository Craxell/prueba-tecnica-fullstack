import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { AddPokemonPage } from './pages/pokemon-add/AddPokemonPage'
import { PokemonDetailPage } from './pages/pokemon-detail'
import { PokemonEditPage } from './pages/pokemon-edit/PokemonEditPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth" element={<Navigate to="/" replace />} />
        <Route path="/app" element={<DashboardPage />} />
        <Route path="/app/pokemon/new" element={<AddPokemonPage />} />
        {/* :favoriteId/edit antes que :favoriteId para que no tome "edit" como id */}
        <Route
          path="/app/pokemon/:favoriteId/edit"
          element={<PokemonEditPage />}
        />
        <Route
          path="/app/pokemon/:favoriteId"
          element={<PokemonDetailPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
