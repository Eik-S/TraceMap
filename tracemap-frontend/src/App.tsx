import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppWrapper } from './components/app/appWrapper'
import { Home } from './components/home'
import { AuthenticationProvider } from './components/login/authenticationContext'
import { Callback } from './components/login/callback'
import { ProtectedRoute } from './components/login/ProtectedRoutes'
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
    <QueryClientProvider client={queryClient}>
      <AuthenticationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login/callback" element={<Callback />} />
            <Route
              path="app/:tweetID"
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
  )
}
