import React, { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { navigateTo } from '../utils/navigation.js'
import { animate, stagger } from 'animejs'
import Navbar from './Navbar.jsx'
import './Home.css'

export default function Home() {
    const { isAuthenticated, logout } = useAuth();
    const heroRef = useRef(null);
    const canvasRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigateTo('/login');
    };

    // Neural network particle canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let particles = [];

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener('resize', resize);

        const colors = ['#E01498', '#7C3AED', '#00B4D8', '#10B981', '#FF5A5F'];

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.offsetWidth;
                this.y = Math.random() * canvas.offsetHeight;
                this.size = Math.random() * 3 + 1.5;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.offsetWidth) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.offsetHeight) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        const particleCount = Math.min(80, Math.floor(canvas.offsetWidth / 12));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const gradient = ctx.createLinearGradient(
                            particles[i].x, particles[i].y,
                            particles[j].x, particles[j].y
                        );
                        gradient.addColorStop(0, particles[i].color);
                        gradient.addColorStop(1, particles[j].color);
                        ctx.strokeStyle = gradient;
                        ctx.globalAlpha = (1 - dist / 140) * 0.25;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
        };

        const loop = () => {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            animId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    // Anime.js entrance animations
    useEffect(() => {
        if (!heroRef.current) return;

        animate('.heroBadge', {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            ease: 'outExpo',
            delay: 100,
        });

        animate('.heroTitle', {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            ease: 'outExpo',
            delay: 250,
        });

        animate('.heroDescription', {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 700,
            ease: 'outExpo',
            delay: 450,
        });

        animate('.heroCtaGroup', {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 700,
            ease: 'outExpo',
            delay: 600,
        });

        animate('.featureCard', {
            opacity: [0, 1],
            translateY: [40, 0],
            scale: [0.92, 1],
            duration: 700,
            delay: stagger(120, { start: 750 }),
            ease: 'outExpo',
        });
    }, []);

    return (
        <div className="homeContainer">
            <Navbar />

            {/* Neural particle canvas background */}
            <canvas ref={canvasRef} className="neuralCanvas"></canvas>

            <main className="homeHero" ref={heroRef}>
                <div className="heroBadge" style={{ opacity: 0 }}>
                    <span className="badgeDot"></span> Next-Gen Neural AI Workspace
                </div>

                <h1 className="heroTitle" style={{ opacity: 0 }}>
                    Experience Intelligence <br />
                    With <span className="synapseBrandText">Synapse AI</span>
                </h1>

                <p className="heroDescription" style={{ opacity: 0 }}>
                    Empowering your workflows with dynamic neural connections, instant reasoning, light & dark theme flexibility, and seamless chat experience.
                </p>

                <div className="heroCtaGroup" style={{ opacity: 0 }}>
                    <button className="primaryCta" onClick={() => navigateTo('/chat')}>
                        <span>Start Chatting</span> <i className="fa-solid fa-arrow-right ctaIcon"></i>
                    </button>

                    {isAuthenticated ? (
                        <button className="secondaryCta" onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <button className="secondaryCta" onClick={() => navigateTo('/login')}>
                            Login
                        </button>
                    )}
                </div>

                <div className="featuresGrid">
                    <div className="featureCard" style={{ opacity: 0 }}>
                        <div className="featureIconWrapper magentaGlow">
                            <i className="fa-solid fa-brain"></i>
                        </div>
                        <h3>Neural Context</h3>
                        <p>Adaptive conversational memory powered by Synapse thread management.</p>
                    </div>

                    <div className="featureCard" style={{ opacity: 0 }}>
                        <div className="featureIconWrapper purpleGlow">
                            <i className="fa-solid fa-bolt"></i>
                        </div>
                        <h3>Real-time Streaming</h3>
                        <p>Lightning fast word-by-word streaming answers with zero delay.</p>
                    </div>

                    <div className="featureCard" style={{ opacity: 0 }}>
                        <div className="featureIconWrapper cyanGlow">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <h3>Secure Authentication</h3>
                        <p>Token-based encrypted session control tailored for privacy.</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
