import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { IOProvider } from './context/IOContext'
import { AuthProvider } from './context/AuthContext'
import { CookiesProvider } from 'react-cookie'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <IOProvider>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </IOProvider>
    </AuthProvider>
  </React.StrictMode>,
)
