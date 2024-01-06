import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppWrapper } from './components/app/app-wrapper'
import { Home } from './components/homepage/home'
import { AuthenticationProvider } from './contexts/authentication-context'
import { Callback } from './components/login/callback'
import { ProtectedRoute } from './components/login/ProtectedRoutes'
import { ThemeProvider } from '@emotion/react'
import { theme } from './styles/theme'
export function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        refetchOnWindowFocus: false,
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthenticationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="login/callback" element={<Callback />} />
              <Route
                path="app/:status/:username"
                element={
                  <ProtectedRoute>
                    <AppWrapper />
                  </ProtectedRoute>
                }
              />
              <Route
                path="app/:status"
                element={
                  <ProtectedRoute>
                    <AppWrapper />
                  </ProtectedRoute>
                }
              />
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
      </QueryClientProvider>
    </ThemeProvider>
  )
}
