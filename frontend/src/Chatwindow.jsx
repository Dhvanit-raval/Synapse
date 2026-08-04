import { useContext, useEffect, useRef, useState } from 'react'
import Chat from './Chat.jsx'
import Navbar from './components/Navbar.jsx'
import { ChatContext } from './context/ChatContext.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { BounceLoader } from "react-spinners"
import { apiUrl } from './utils/apiBase.js'
import { isMessageSoundEnabled } from './utils/preferences.js'
import './Chatwindow.css'

function playMessageSound() {
    if (!isMessageSoundEnabled()) return;

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.08);
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.16);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.18);
    } catch (err) {
        console.log(err);
    }
}

export default function Chatwindow({ onToggleSidebar, isSidebarVisible }) {
    const { token } = useAuth();
    const { prompt, setPrompt, reply, setReply, threadId, setPreviousChats, setNewChat } = useContext(ChatContext);
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef(null);

    const abortCurrentRequest = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    };

    const getReply = async () => {
        if (loading) {
            abortCurrentRequest();
            setReply(null);
            return;
        }

        const currentPrompt = prompt.trim();
        if (!currentPrompt) return;

        setPrompt("");
        setReply(null);
        setLoading(true);
        setNewChat(false);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                message: currentPrompt,
                threadId: threadId
            }),
            signal: controller.signal
        };

        try {
            const response = await fetch(apiUrl('/api/chat'), options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || `Request failed with status ${response.status}`);
            }

            const aiReply = data?.reply || "";
            setReply(aiReply);
            playMessageSound();
            setPreviousChats((previousChats) => [
                ...previousChats,
                {
                    role: "user",
                    content: currentPrompt
                },
                {
                    role: "assistant",
                    content: aiReply
                }
            ]);
        }
        catch (err) {
            if (err?.name === 'AbortError') {
                return;
            }
            console.log(err);
        }
        finally {
            abortControllerRef.current = null;
            setLoading(false);
        }
    };

    return (
        <div className="chatWindow">
            <Navbar onToggleSidebar={onToggleSidebar} isSidebarVisible={isSidebarVisible} />
            <div className="chatScrollArea">
                <Chat></Chat>
                {loading && (
                    <div className="loaderWrapper">
                        <BounceLoader color='#E01498' size={36} loading={loading}></BounceLoader>
                    </div>
                )}
            </div>
            <div className="chatInput">
                <div className="userInput">
                    <input type="text" placeholder={loading ? 'Stopping response…' : 'Ask Synapse anything...'}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className={`submit ${loading ? 'loading' : ''}`}
                        onClick={getReply}
                        title={loading ? 'Stop response' : 'Send message'}
                        aria-label={loading ? 'Stop response' : 'Send message'}
                    >
                        <i className={`fa-solid ${loading ? 'fa-stop' : 'fa-paper-plane'} submitIcon`}></i>
                    </button>
                </div>
                <p className="info"><i className="fa-solid fa-circle-info infoIcon"></i> Synapse can make mistakes. Verify important info.</p>
            </div>
        </div>
    )
}
