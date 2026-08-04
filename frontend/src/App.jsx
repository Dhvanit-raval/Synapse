import Sidebar from './components/Sidebar.jsx'
import Chatwindow from './Chatwindow.jsx'
import { useEffect, useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import Home from './components/Home.jsx'
import Login from './components/Login/Login.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ChatProvider } from './context/ChatContext.jsx';
import './App.css'

function ChatLayout({ sidebarVisible, toggleSidebar }) {
  return (
    <ChatProvider>
      <div className={`chatLayout ${sidebarVisible ? '' : 'sidebar-hidden'}`}>
        <Sidebar isVisible={sidebarVisible} onClose={toggleSidebar} />
        <Chatwindow onToggleSidebar={toggleSidebar} isSidebarVisible={sidebarVisible} />
      </div>
    </ChatProvider>
  )
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [sidebarVisible, setSidebarVisible] = useState(true);

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
          <ChatLayout
            sidebarVisible={sidebarVisible}
            toggleSidebar={() => setSidebarVisible((prev) => !prev)}
          />
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
