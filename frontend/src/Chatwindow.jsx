import { useContext, useEffect, useState } from 'react'
import Chat from './Chat.jsx'
import Navbar from './components/Navbar.jsx'
import { ChatContext } from './context/ChatContext.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { BounceLoader } from "react-spinners"
import { apiUrl } from './utils/apiBase.js'
import './Chatwindow.css'

export default function Chatwindow() {
    const { token } = useAuth();
    const { prompt, setPrompt, reply, setReply, threadId, setPreviousChats, setNewChat } = useContext(ChatContext);
    const [loading, setLoading] = useState(false);
    const [submittedPrompt, setSubmittedPrompt] = useState("");

    //*Append new chats
    useEffect(() => {
        if (submittedPrompt && reply) {
            setPreviousChats((previousChats) => [
                ...previousChats,
                {
                    role: "user",
                    content: submittedPrompt
                },
                {
                    role: "assistant",
                    content: reply
                }
            ]);
        }
        setPrompt("")

    }, [reply, setPreviousChats, setPrompt, submittedPrompt])


    const getReply = async () => {
        if (!prompt.trim()) return;
        const currentPrompt = prompt;
        setSubmittedPrompt(currentPrompt);
        setLoading(true);
        setNewChat(false);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                message: currentPrompt,
                threadId: threadId
            })
        };

        try {
            const response = await fetch(apiUrl('/api/chat'), options);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || `Request failed with status ${response.status}`);
            }
            setReply(data?.reply || "");
            console.log(data);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="chatWindow">
            <Navbar></Navbar>
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
                    <input type="text" placeholder='Ask Synapse anything...'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <div className="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane submitIcon"></i>
                    </div>
                </div>
                <p className="info"><i className="fa-solid fa-circle-info infoIcon"></i> Synapse can make mistakes. Verify important info.</p>
            </div>
        </div>
    )
}
