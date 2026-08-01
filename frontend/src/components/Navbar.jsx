import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { navigateTo } from '../utils/navigation.js'
import logo from '../assets/logo2.png'
import Settings from './Settings/Settings.jsx'
import './Navbar.css'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('synapse_theme') || 'dark');
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('synapse_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    const handleLogout = () => {
        logout();
        navigateTo('/login');
    };

    return (
        <>
            <div className="navbar">
                <div className="navBrand" onClick={() => navigateTo('/')}>
                    <div className="navLogoWrapper">
                        <img src={logo} alt="Synapse" className="navLogoImg" />
                    </div>
                    <span className="synapseBrandText">Synapse</span>
                    <span className="navBrandBeta">AI</span>
                </div>

                <div className="navActions">
                    <button className="themeToggleBtn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
                        <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
                    </button>

                    <button className="navIconBtn" onClick={() => { setSettingsOpen(true); setIsOpen(false); }} title="Settings">
                        <i className="fa-solid fa-gear"></i>
                    </button>

                    {isAuthenticated ? (
                        <button className="authBtn" onClick={handleLogout}>
                            <i className="fa-solid fa-right-from-bracket"></i> Logout
                        </button>
                    ) : (
                        <button className="authBtn" onClick={() => navigateTo('/login')}>
                            <i className="fa-solid fa-right-to-bracket"></i> Login
                        </button>
                    )}

                    <div className="userIcon" onClick={() => setIsOpen(!isOpen)}>
                        <i className="fa-solid fa-user"></i>
                    </div>
                </div>

                {
                    isOpen && <div className="dropdown">
                        <div className="dropDownItem" onClick={toggleTheme}>
                            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i> {theme === 'dark' ? 'Light' : 'Dark'} Mode
                        </div>
                        <div className="dropDownItem" onClick={() => { setSettingsOpen(true); setIsOpen(false); }}>
                            <i className="fa-solid fa-gear"></i> Settings
                        </div>
                        {isAuthenticated ? (
                            <div className="dropDownItem" onClick={handleLogout}>
                                <i className="fa-solid fa-right-from-bracket"></i> Logout
                            </div>
                        ) : (
                            <div className="dropDownItem" onClick={() => navigateTo('/login')}>
                                <i className="fa-solid fa-right-to-bracket"></i> Login
                            </div>
                        )}
                    </div>
                }
            </div>

            <Settings
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                currentTheme={theme}
                onThemeChange={handleThemeChange}
            />
        </>
    )
}
