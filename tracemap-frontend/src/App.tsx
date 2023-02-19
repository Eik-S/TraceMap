import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/home'
import { Callback } from './components/login/callback'
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  )
}
