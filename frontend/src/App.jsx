import Sidebar from './components/Sidebar.jsx'
import Chatwindow from './Chatwindow.jsx'
import { useEffect, useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import Home from './components/Home.jsx'
import Login from './components/Login/Login.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ChatProvider } from './context/ChatContext.jsx';
import './App.css'

function ChatLayout() {
  return (
    <ChatProvider>
      <>
        <Sidebar />
        <Chatwindow />
      </>
    </ChatProvider>
  )
}

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname);

    window.addEventListener('popstate', updatePath);
    window.addEventListener('synapse:navigate', updatePath);

    return () => {
      window.removeEventListener('popstate', updatePath);
      window.removeEventListener('synapse:navigate', updatePath);
    };
  }, []);

  const renderRoute = () => {
    if (path === '/login') return <Login />;
    if (path === '/chat') {
      return (
        <ProtectedRoute>
          <ChatLayout />
        </ProtectedRoute>
      );
    }
    return <Home />;
  };

  return (
    <AuthProvider>
      <div className="main">
        {renderRoute()}
      </div>
    </AuthProvider>
  )
}

export default App
