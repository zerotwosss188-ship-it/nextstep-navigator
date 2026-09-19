import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { BookmarkProvider } from './context/BookmarkContext.jsx'
import { CompareProvider } from './context/CompareContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import ToastContainer from './context/ToastContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <UserProvider>
      <BookmarkProvider>
        <CompareProvider>
          <App />
          <ToastContainer />
        </CompareProvider>
      </BookmarkProvider>
    </UserProvider>
  </ThemeProvider>
)