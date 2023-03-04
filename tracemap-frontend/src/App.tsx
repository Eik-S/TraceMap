import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppWrapper } from './components/app/appWrapper'
import { Home } from './components/home'
import { AuthenticationProvider } from './components/login/authenticationContext'
import { Callback } from './components/login/callback'
import { ProtectedRoute } from './components/login/ProtectedRoutes'
export function App() {
  return (
    <AuthenticationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login/callback" element={<Callback />} />
          <Route
            path="app"
            element={
              <ProtectedRoute>
                <AppWrapper />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthenticationProvider>
  )
}
