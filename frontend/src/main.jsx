import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from "./context/AuthContext.jsx"
import { SocketProvider } from "./context/SocketContext.jsx"
import App from './App.jsx'
import "./index.css"



createRoot(document.getElementById("root")).render(
  <StrictMode>
      <AuthProvider>
        <SocketProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                border: '2px solid #000',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 'bold',
                fontSize: '13px',
                boxShadow: '3px 3px 0px #000',
                borderRadius: '0',
              },
              success: {
                style: { background: '#4ade80', color: '#000' },
                duration: 3000,
              },
              error: {
                style: { background: '#ef4444', color: '#fff' },
                duration: 4000,
              },
            }}
          />
        </SocketProvider>
      </AuthProvider>
  </StrictMode>
);
