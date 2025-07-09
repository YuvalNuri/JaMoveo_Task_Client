import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRouter from './routes/AppRouter'
import { AuthProvider } from './context/AuthContext'
import ApiContextProvider from './context/ApiContext'
import Header from './components/layout/Header'
import { SocketProvider } from './context/SocketContext'

function App() {
  return (
    <>
      <ApiContextProvider>
        <SocketProvider>
          <AuthProvider>
            <div className='main-app'>
              <div className="floating-shapes">
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
              </div>
              <div className='app-container'>
              <Header />
              <AppRouter />
              </div>
            </div>
          </AuthProvider>
        </SocketProvider>
      </ApiContextProvider>
    </>
  )
}

export default App
