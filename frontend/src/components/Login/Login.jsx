import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { navigateTo } from '../../utils/navigation.js';
import { animate, stagger } from 'animejs';
import logo from '../../assets/logo2.png';
import './Login.css';

export default function Login() {
    const { login, register } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const cardRef = useRef(null);
    const orbitRef = useRef(null);

    useEffect(() => {
        // Reset error on view toggle
        setError(null);
        // Animate the login card entrance
        if (cardRef.current) {
            animate(cardRef.current, {
                opacity: [0, 1],
                translateY: [40, 0],
                scale: [0.95, 1],
                duration: 800,
                ease: 'outExpo',
            });
        }

        // Animate the floating orbs around the card
        if (orbitRef.current) {
            const orbs = orbitRef.current.querySelectorAll('.loginOrb');
            animate(orbs, {
                translateY: [-20, 20],
                opacity: [0.3, 0.8],
                duration: 3000,
                delay: stagger(400),
                loop: true,
                alternate: true,
                ease: 'inOutSine',
            });
        }
    }, [isRegistering]);

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isRegistering) {
                await register({ name, username, email, password });
                // After successful registration, switch to login view and notify user
                setIsRegistering(false);
                setError('Registration successful! Please log in.');
                // Clear registration form fields
                setName('');
                setEmail('');
                setUserName('');
                setPassword('');
            } else {
                await login({
                    username,
                    password
                });
                navigateTo('/chat');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
            // Shake animation on error
            if (cardRef.current) {
                animate(cardRef.current, {
                    translateX: [-12, 12, -8, 8, -4, 4, 0],
                    duration: 500,
                    ease: 'outElastic(1, .6)',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div className="loginPage">
            {/* Floating 3D orbs background */}
            <div className="loginOrbField" ref={orbitRef}>
                <div className="loginOrb orb1"></div>
                <div className="loginOrb orb2"></div>
                <div className="loginOrb orb3"></div>
                <div className="loginOrb orb4"></div>
                <div className="loginOrb orb5"></div>
            </div>

            <div className="loginCard" ref={cardRef} key={isRegistering ? 'register' : 'login'}>
                <div className="loginHeader">
                    <div className="loginLogoRing">
                        <img src={logo} alt="Synapse Logo" className="loginLogo" />
                    </div>
                    <h2>{isRegistering ? 'Create Account' : 'Welcome to'} <span className="synapseBrandText">Synapse</span></h2>
                    <p className="loginSubtitle">{isRegistering ? 'Start your journey with us' : 'Sign in to access your neural chat threads'}</p>
                </div>

                {error && (
                    <div className="error-message">
                        <i className="fa-solid fa-circle-exclamation"></i> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="loginForm">
                    {isRegistering && (
                        <>
                            <label className="formField">
                                <span>Name</span>
                                <div className="inputWithIcon">
                                    <i className="fa-solid fa-user inputIcon"></i>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </label>
                            <label className="formField">
                                <span>Email</span>
                                <div className="inputWithIcon">
                                    <i className="fa-solid fa-envelope inputIcon"></i>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </label>
                        </>
                    )}
                    <label className="formField">
                        <span>Username</span>
                        <div className="inputWithIcon">
                            <i className="fa-solid fa-at inputIcon"></i>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={e => setUserName(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                    </label>

                    <label className="formField">
                        <span>Password</span>
                        <div className="inputWithIcon">
                            <i className="fa-solid fa-lock inputIcon"></i>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                    </label>

                    <div className="formActions">
                        <button type="submit" className="submitAuthBtn" disabled={loading}>
                            {loading ? (
                                <span className="btnLoading">
                                    <i className="fa-solid fa-spinner fa-spin"></i> Authenticating...
                                </span>
                            ) : (
                                isRegistering ? (
                                    <span className="btnReady">
                                        <i className="fa-solid fa-user-plus"></i> Register
                                    </span>
                                ) : (
                                    <span className="btnReady">
                                        <i className="fa-solid fa-right-to-bracket"></i> Sign In
                                    </span>
                                )
                            )}
                        </button>
                    </div>
                </form>

                <div className="loginFooter">
                    <p>{isRegistering ? 'Already have an account?' : "Don't have an account?"} <button type="button" className="toggle-btn" onClick={toggleForm}>{isRegistering ? 'Sign In' : 'Register'}</button></p>
                </div>
            </div>
        </div>
    );
}
