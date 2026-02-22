import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/app' 
import './index.css' 

// 1. Force the entire document to Right-to-Left for Farsi
document.documentElement.dir = "rtl";
document.documentElement.lang = "fa";

// 2. PREVENT BLACK SCREEN: Ensure a default background color is set immediately
document.body.className = "bg-background text-foreground transition-colors duration-300";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)