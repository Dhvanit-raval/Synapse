import React, { useState, useEffect, useRef } from 'react';
import { animate } from 'animejs';
import logo from '../../assets/logo2.png';
import {
    announcePreferenceChange,
    applySynapsePreferences,
    getSynapsePreferences,
    saveSynapsePreference,
} from '../../utils/preferences.js';
import './Settings.css';

export default function Settings({ isOpen, onClose, currentTheme, onThemeChange }) {
    const [fontSize, setFontSize] = useState(() => getSynapsePreferences().fontSize);
    const [chatBubbleStyle, setChatBubbleStyle] = useState(() => getSynapsePreferences().bubbleStyle);
    const [animationsEnabled, setAnimationsEnabled] = useState(() => getSynapsePreferences().animationsEnabled);
    const [messageSound, setMessageSound] = useState(() => getSynapsePreferences().messageSound);
    const panelRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (isOpen && panelRef.current && overlayRef.current) {
            if (!animationsEnabled) {
                overlayRef.current.style.opacity = 1;
                panelRef.current.style.transform = 'translateX(0%)';
                return;
            }

            animate(overlayRef.current, {
                opacity: [0, 1],
                duration: 250,
                ease: 'outQuad',
            });
            animate(panelRef.current, {
                translateX: ['100%', '0%'],
                duration: 400,
                ease: 'outExpo',
            });
        }
    }, [isOpen, animationsEnabled]);

    useEffect(() => {
        saveSynapsePreference('fontSize', fontSize);
        applySynapsePreferences({
            ...getSynapsePreferences(),
            fontSize,
        });
        announcePreferenceChange();
    }, [fontSize]);

    useEffect(() => {
        saveSynapsePreference('bubbleStyle', chatBubbleStyle);
        applySynapsePreferences({
            ...getSynapsePreferences(),
            bubbleStyle: chatBubbleStyle,
        });
        announcePreferenceChange();
    }, [chatBubbleStyle]);

    useEffect(() => {
        saveSynapsePreference('animations', animationsEnabled);
        applySynapsePreferences({
            ...getSynapsePreferences(),
            animationsEnabled,
        });
        announcePreferenceChange();
    }, [animationsEnabled]);

    useEffect(() => {
        saveSynapsePreference('sound', messageSound);
        applySynapsePreferences({
            ...getSynapsePreferences(),
            messageSound,
        });
        announcePreferenceChange();
    }, [messageSound]);

    const handleClose = () => {
        if (panelRef.current && overlayRef.current) {
            if (!animationsEnabled) {
                onClose();
                return;
            }

            animate(panelRef.current, {
                translateX: ['0%', '100%'],
                duration: 300,
                ease: 'inQuad',
            });
            animate(overlayRef.current, {
                opacity: [1, 0],
                duration: 250,
                ease: 'inQuad',
                onComplete: () => onClose(),
            });
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="settingsOverlay" ref={overlayRef} onClick={handleClose}>
            <div className="settingsPanel" ref={panelRef} onClick={e => e.stopPropagation()}>
                <div className="settingsHeader">
                    <h3><i className="fa-solid fa-gear settingsGearIcon"></i> Settings</h3>
                    <button className="settingsCloseBtn" onClick={handleClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="settingsSections">
                    <div className="settingsSection">
                        <h4 className="sectionLabel">
                            <i className="fa-solid fa-palette"></i> Appearance
                        </h4>

                        <div className="settingRow">
                            <div className="settingInfo">
                                <span className="settingName">Theme</span>
                                <span className="settingDesc">Choose between light and dark mode</span>
                            </div>
                            <div className="themeSwitch">
                                <button
                                    className={`themePill ${currentTheme === 'dark' ? 'active' : ''}`}
                                    onClick={() => onThemeChange('dark')}
                                >
                                    <i className="fa-solid fa-moon"></i> Dark
                                </button>
                                <button
                                    className={`themePill ${currentTheme === 'light' ? 'active' : ''}`}
                                    onClick={() => onThemeChange('light')}
                                >
                                    <i className="fa-solid fa-sun"></i> Light
                                </button>
                            </div>
                        </div>

                        <div className="settingRow">
                            <div className="settingInfo">
                                <span className="settingName">Font Size</span>
                                <span className="settingDesc">Adjust text size for readability</span>
                            </div>
                            <div className="fontSizeSelector">
                                {['small', 'medium', 'large'].map(size => (
                                    <button
                                        key={size}
                                        className={`fontPill ${fontSize === size ? 'active' : ''}`}
                                        onClick={() => setFontSize(size)}
                                    >
                                        {size.charAt(0).toUpperCase() + size.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="settingsSection">
                        <h4 className="sectionLabel">
                            <i className="fa-solid fa-comments"></i> Chat
                        </h4>

                        <div className="settingRow">
                            <div className="settingInfo">
                                <span className="settingName">Message Bubble Style</span>
                                <span className="settingDesc">Choose bubble corner style</span>
                            </div>
                            <div className="bubbleSelector">
                                {['rounded', 'sharp', 'pill'].map(style => (
                                    <button
                                        key={style}
                                        className={`bubblePill ${chatBubbleStyle === style ? 'active' : ''}`}
                                        onClick={() => setChatBubbleStyle(style)}
                                    >
                                        {style.charAt(0).toUpperCase() + style.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="settingsSection">
                        <h4 className="sectionLabel">
                            <i className="fa-solid fa-sliders"></i> Preferences
                        </h4>

                        <div className="settingRow">
                            <div className="settingInfo">
                                <span className="settingName">Animations</span>
                                <span className="settingDesc">Enable smooth transitions & effects</span>
                            </div>
                            <label className="toggleSwitch">
                                <input
                                    type="checkbox"
                                    checked={animationsEnabled}
                                    onChange={(e) => setAnimationsEnabled(e.target.checked)}
                                />
                                <span className="toggleSlider"></span>
                            </label>
                        </div>

                        <div className="settingRow">
                            <div className="settingInfo">
                                <span className="settingName">Message Sounds</span>
                                <span className="settingDesc">Play sound on new messages</span>
                            </div>
                            <label className="toggleSwitch">
                                <input
                                    type="checkbox"
                                    checked={messageSound}
                                    onChange={(e) => setMessageSound(e.target.checked)}
                                />
                                <span className="toggleSlider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="settingsSection aboutSection">
                        <h4 className="sectionLabel">
                            <i className="fa-solid fa-circle-info"></i> About
                        </h4>
                        <div className="aboutCard">
                            <img src={logo} alt="Synapse" className="aboutLogo" />
                            <div className="aboutInfo">
                                <h5>Synapse AI</h5>
                                <p>Version 1.0.0</p>
                                <p className="aboutTagline">Neural Intelligence Chat Platform</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
