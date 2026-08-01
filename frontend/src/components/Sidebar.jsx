import React, { useCallback, useContext, useEffect } from 'react'
import { ChatContext } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import { v4 as uuidv4 } from 'uuid'
import { apiUrl } from '../utils/apiBase.js'
import logo from '../assets/logo2.png'
import './Sidebar.css'

export default function Sidebar() {
    const { token } = useAuth();
    const { allThreads, setAllThreads, threadId, setNewChat, setReply, setPrompt, setThreadId, setPreviousChats } = useContext(ChatContext)

    const getAllThreads = useCallback(async () => {
        try {
            const response = await fetch(apiUrl('/api/thread'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const res = await response.json();
            const filtreData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }))
            setAllThreads(filtreData);
        }
        catch (err) {
            console.log(err);
        }
    }, [setAllThreads, token])

    useEffect(() => {
        getAllThreads();
    }, [getAllThreads, threadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setThreadId(uuidv4());
        setPreviousChats([]);
    }

    const changeThread = async (newThreadId) => {
        setThreadId(newThreadId);

        try {
            const response = await fetch(apiUrl(`/api/thread/${newThreadId}`), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const res = await response.json();
            setPreviousChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    }

    const deleteThread = async (targetThreadId) => {
        try {
            const response = await fetch(apiUrl(`/api/thread/${targetThreadId}`), {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            //Updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== targetThreadId))

            if (targetThreadId === threadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">
            <div className="sidebarHeader">
                <button className="newChatBtn" onClick={createNewChat}>
                    <div className="logoWrapper">
                        <img src={logo} alt="Synapse Logo" className='logo' />
                    </div>
                    <span className="newChatText">New Chat</span>
                    <i className="fa-solid fa-pen-to-square newChat"></i>
                </button>
            </div>

            <div className="historySection">
                <p className="historyLabel">Chat History</p>
                <ul className="history">
                    {
                        allThreads?.map((thread, idx) => (
                            <li key={idx} className={thread.threadId === threadId ? "activeHistoryItem" : ""} onClick={() => changeThread(thread.threadId)}>
                                <i className="fa-regular fa-message threadIcon"></i>
                                <span className="threadTitle">{thread.title}</span>
                                <i className="fa-solid fa-trash"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deleteThread(thread.threadId)
                                    }}
                                ></i>

                            </li>
                        ))
                    }
                </ul>
            </div>
        </section >
    )
}
