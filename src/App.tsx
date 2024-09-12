  import React, { useEffect, useState } from 'react';
  import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
  import APIProviderList from './components/APIProviders/APIProviders';
  import APIDetails from './components/APIDetails/APIDetails';
  import './App.css';

  const AppContent: React.FC = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [url, seturl] = useState<string>('');

    useEffect(() => {
      seturl(location.pathname.split('/')[1]);
    }, [location]);

    useEffect(() => {
      if (sidebarOpen) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    }, [sidebarOpen]);

    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };

    return (
      <div className={url === "provider" ? 'provider-app' : 'app' }>
        
        <APIProviderList sidebarOpen={sidebarOpen} />
        <Routes>
          <Route path="/" element={<APIProviderList sidebarOpen={sidebarOpen} />} />
          <Route path="/provider/:provider" element={<APIDetails />} />
        </Routes>
        <button className={url === "provider" ? 'provider-button' : 'button' } onClick={toggleSidebar}>
          Explore Web APIs
        </button>
      </div>
    );
  };

  const App: React.FC = () => {
    return (
      <Router>
        <AppContent />
      </Router>
    );
  };

  export default App;
